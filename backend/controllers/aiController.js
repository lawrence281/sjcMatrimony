const Anthropic = require('@anthropic-ai/sdk');
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const { sendAIInsights } = require('../services/whatsappService');

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// MCP-style tools that Claude can call to fetch MongoDB data
const mongoTools = [
  {
    name: 'get_sales_summary',
    description: 'Get overall sales summary including total orders, revenue, and recent trends',
    input_schema: { type: 'object', properties: {}, required: [] },
  },
  {
    name: 'get_top_products',
    description: 'Get the top performing products by sales count',
    input_schema: {
      type: 'object',
      properties: { limit: { type: 'number', description: 'Number of products to return (default 5)' } },
      required: [],
    },
  },
  {
    name: 'get_orders_by_geo',
    description: 'Get order distribution by geographical location',
    input_schema: { type: 'object', properties: {}, required: [] },
  },
  {
    name: 'get_monthly_revenue',
    description: 'Get monthly revenue data for the past 6 months',
    input_schema: { type: 'object', properties: {}, required: [] },
  },
  {
    name: 'get_top_customers',
    description: 'Get the top customers by order count and spending',
    input_schema: { type: 'object', properties: {}, required: [] },
  },
  {
    name: 'get_inventory_status',
    description: 'Get current inventory status and low-stock products',
    input_schema: { type: 'object', properties: {}, required: [] },
  },
];

// Tool execution function - these are the "MCP" handlers
const executeTool = async (toolName, toolInput) => {
  switch (toolName) {
    case 'get_sales_summary': {
      const [totalOrders, revenueAgg] = await Promise.all([
        Order.countDocuments(),
        Order.aggregate([{ $group: { _id: null, total: { $sum: '$total' }, avgOrder: { $avg: '$total' } } }]),
      ]);
      const pendingOrders = await Order.countDocuments({ status: 'pending' });
      const deliveredOrders = await Order.countDocuments({ status: 'delivered' });
      return {
        totalOrders, pendingOrders, deliveredOrders,
        totalRevenue: revenueAgg[0]?.total || 0,
        averageOrderValue: revenueAgg[0]?.avgOrder || 0,
      };
    }
    case 'get_top_products': {
      const limit = toolInput.limit || 5;
      const products = await Product.find()
        .populate('category', 'name')
        .sort('-salesCount')
        .limit(limit)
        .select('name salesCount price averageRating totalReviews stock category');
      return products.map(p => ({
        name: p.name, category: p.category?.name, salesCount: p.salesCount,
        price: p.price, avgRating: p.averageRating, reviews: p.totalReviews, stock: p.stock,
      }));
    }
    case 'get_orders_by_geo': {
      const geo = await Order.aggregate([
        { $group: { _id: { city: '$shippingAddress.city', state: '$shippingAddress.state' }, count: { $sum: 1 }, revenue: { $sum: '$total' } } },
        { $sort: { count: -1 } }, { $limit: 10 },
      ]);
      return geo.map(g => ({ city: g._id.city, state: g._id.state, orders: g.count, revenue: g.revenue }));
    }
    case 'get_monthly_revenue': {
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
      const monthly = await Order.aggregate([
        { $match: { createdAt: { $gte: sixMonthsAgo } } },
        { $group: { _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } }, revenue: { $sum: '$total' }, orders: { $sum: 1 } } },
        { $sort: { '_id.year': 1, '_id.month': 1 } },
      ]);
      return monthly;
    }
    case 'get_top_customers': {
      const topUsers = await Order.aggregate([
        { $match: { user: { $exists: true, $ne: null } } },
        { $group: { _id: '$user', orderCount: { $sum: 1 }, totalSpent: { $sum: '$total' } } },
        { $sort: { totalSpent: -1 } }, { $limit: 5 },
        { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'u' } },
        { $unwind: '$u' },
        { $project: { name: '$u.name', email: '$u.email', orderCount: 1, totalSpent: 1 } },
      ]);
      return topUsers;
    }
    case 'get_inventory_status': {
      const lowStock = await Product.find({ stock: { $lt: 10 }, isActive: true }).select('name stock price salesCount');
      const outOfStock = await Product.countDocuments({ stock: 0 });
      const totalProducts = await Product.countDocuments({ isActive: true });
      return { totalProducts, outOfStock, lowStockProducts: lowStock };
    }
    default:
      return { error: 'Unknown tool' };
  }
};

// POST /api/ai/analyze
const analyze = async (req, res) => {
  try {
    if (!process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY === 'your_anthropic_api_key_here') {
      return res.json({
        success: true,
        insights: {
          suggestions: ['Configure your ANTHROPIC_API_KEY to enable AI insights.'],
          salesAnalysis: 'AI analysis unavailable — API key not configured.',
          productInsights: 'Please add your Anthropic API key to the backend .env file.',
          predictions: 'AI predictions require a valid ANTHROPIC_API_KEY.',
          summary: 'Add ANTHROPIC_API_KEY to backend/.env to enable Claude AI analysis.',
        },
      });
    }

    const systemPrompt = `You are a senior eCommerce business analyst AI. You have access to MongoDB tools to fetch live business data. 
Analyze the data and provide actionable insights in JSON format with these exact keys:
- "suggestions": array of 3-5 specific business improvement suggestions
- "salesAnalysis": detailed sales performance analysis paragraph  
- "productInsights": product performance insights paragraph
- "predictions": sales predictions and forecasts paragraph
- "summary": one-sentence executive summary
Always call the available tools to get real data before analyzing.`;

    const messages = [{ role: 'user', content: 'Analyze our eCommerce store performance and provide comprehensive business insights with predictions.' }];

    let response = await client.messages.create({
      model: 'claude-opus-4-5',
      max_tokens: 4096,
      system: systemPrompt,
      tools: mongoTools,
      messages,
    });

    // Tool-use loop (MCP pattern)
    while (response.stop_reason === 'tool_use') {
      const toolUseBlocks = response.content.filter(b => b.type === 'tool_use');
      const toolResults = [];

      for (const toolUse of toolUseBlocks) {
        const result = await executeTool(toolUse.name, toolUse.input);
        toolResults.push({ type: 'tool_result', tool_use_id: toolUse.id, content: JSON.stringify(result) });
      }

      messages.push({ role: 'assistant', content: response.content });
      messages.push({ role: 'user', content: toolResults });

      response = await client.messages.create({
        model: 'claude-opus-4-5',
        max_tokens: 4096,
        system: systemPrompt,
        tools: mongoTools,
        messages,
      });
    }

    // Parse the final text response as JSON
    const textContent = response.content.find(b => b.type === 'text');
    let insights;
    try {
      const jsonMatch = textContent.text.match(/\{[\s\S]*\}/);
      insights = jsonMatch ? JSON.parse(jsonMatch[0]) : { summary: textContent.text };
    } catch {
      insights = { summary: textContent.text, suggestions: [], salesAnalysis: '', productInsights: '', predictions: '' };
    }

    // Send insights to WhatsApp
    sendAIInsights(insights).catch(err => console.log('WhatsApp AI insights failed:', err.message));

    res.json({ success: true, insights });
  } catch (error) {
    console.error('AI analyze error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { analyze };
