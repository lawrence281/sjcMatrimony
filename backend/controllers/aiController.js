const Anthropic = require('@anthropic-ai/sdk');
const User = require('../models/User');
const UserProfile = require('../models/UserProfile');
const { sendAIInsights } = require('../services/whatsappService');

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// MCP-style tools that Claude can call to fetch MongoDB data
const mongoTools = [
  {
    name: 'get_profile_stats',
    description: 'Get overall profile statistics including total profiles, active members, and pending verifications',
    input_schema: { type: 'object', properties: {}, required: [] },
  },
  {
    name: 'get_membership_breakdown',
    description: 'Get breakdown of profiles by membership type (Free, Silver, Gold, Platinum)',
    input_schema: { type: 'object', properties: {}, required: [] },
  },
  {
    name: 'get_recent_registrations',
    description: 'Get monthly registration counts for the past 6 months',
    input_schema: { type: 'object', properties: {}, required: [] },
  },
  {
    name: 'get_profile_status_breakdown',
    description: 'Get breakdown of profiles by status (Active, Pending, Suspended, Rejected)',
    input_schema: { type: 'object', properties: {}, required: [] },
  },
  {
    name: 'get_gender_distribution',
    description: 'Get the distribution of male and female profiles',
    input_schema: { type: 'object', properties: {}, required: [] },
  },
  {
    name: 'get_top_members',
    description: 'Get recently joined or active premium members',
    input_schema: { type: 'object', properties: {}, required: [] },
  },
];

// Tool execution function
const executeTool = async (toolName, toolInput) => {
  switch (toolName) {
    case 'get_profile_stats': {
      const [totalUsers, totalProfiles, activeProfiles, pendingVerifications] = await Promise.all([
        User.countDocuments({ role: 'user' }),
        UserProfile.countDocuments(),
        UserProfile.countDocuments({ profileStatus: 'Active' }),
        UserProfile.countDocuments({ verificationStatus: 'Unverified' }),
      ]);
      return { totalUsers, totalProfiles, activeProfiles, pendingVerifications };
    }
    case 'get_membership_breakdown': {
      const breakdown = await UserProfile.aggregate([
        { $group: { _id: '$membershipType', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]);
      return breakdown.map(b => ({ membershipType: b._id || 'Free', count: b.count }));
    }
    case 'get_recent_registrations': {
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
      const monthly = await User.aggregate([
        { $match: { createdAt: { $gte: sixMonthsAgo }, role: 'user' } },
        {
          $group: {
            _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
            count: { $sum: 1 },
          },
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } },
      ]);
      return monthly;
    }
    case 'get_profile_status_breakdown': {
      const statuses = await UserProfile.aggregate([
        { $group: { _id: '$profileStatus', count: { $sum: 1 } } },
      ]);
      return statuses.map(s => ({ status: s._id || 'Pending', count: s.count }));
    }
    case 'get_gender_distribution': {
      const genders = await UserProfile.aggregate([
        { $group: { _id: '$gender', count: { $sum: 1 } } },
      ]);
      return genders.map(g => ({ gender: g._id || 'Not specified', count: g.count }));
    }
    case 'get_top_members': {
      const members = await UserProfile.find({ membershipType: { $ne: 'Free' } })
        .populate('userId', 'name email')
        .sort('-createdAt')
        .limit(5)
        .select('firstName lastName membershipType profileStatus verificationStatus userId');
      return members.map(m => ({
        name: `${m.firstName || ''} ${m.lastName || ''}`.trim() || m.userId?.name,
        email: m.userId?.email,
        membership: m.membershipType,
        status: m.profileStatus,
      }));
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

    const systemPrompt = `You are a senior matrimony platform business analyst AI. You have access to MongoDB tools to fetch live platform data. 
Analyze the data and provide actionable insights in JSON format with these exact keys:
- "suggestions": array of 3-5 specific platform improvement suggestions
- "salesAnalysis": detailed membership and engagement analysis paragraph  
- "productInsights": profile quality and completion insights paragraph
- "predictions": registration growth predictions and trends paragraph
- "summary": one-sentence executive summary
Always call the available tools to get real data before analyzing.`;

    const messages = [{ role: 'user', content: 'Analyze our matrimony platform performance and provide comprehensive business insights with predictions.' }];

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
