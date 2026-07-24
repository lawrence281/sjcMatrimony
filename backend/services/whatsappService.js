const twilio = require('twilio');

const sendWhatsApp = async (message) => {
  if (!process.env.TWILIO_ACCOUNT_SID || process.env.TWILIO_ACCOUNT_SID === 'your_twilio_account_sid_here') {
    console.log('📱 WhatsApp (not configured):', message.substring(0, 100) + '...');
    return;
  }
  const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
  await client.messages.create({
    from: process.env.TWILIO_WHATSAPP_FROM,
    to: process.env.TWILIO_WHATSAPP_TO,
    body: message,
  });
  console.log('✅ WhatsApp message sent');
};

const sendOrderNotification = async (order) => {
  const itemsList = order.items.map(i => `  • ${i.name} x${i.quantity} — $${(i.price * i.quantity).toFixed(2)}`).join('\n');
  const message = `🛒 *New Order Received!*

📦 Order ID: ${order._id}
👤 Customer: ${order.shippingAddress.fullName}
📍 City: ${order.shippingAddress.city}, ${order.shippingAddress.state}

*Items:*
${itemsList}

💰 Subtotal: $${order.subtotal?.toFixed(2)}
🚚 Shipping: ${order.shipping === 0 ? 'FREE' : '$' + order.shipping?.toFixed(2)}
💵 Total: $${order.total?.toFixed(2)}

📅 ${new Date(order.createdAt).toLocaleString()}`;

  await sendWhatsApp(message);
};

const sendAIInsights = async (insights) => {
  const suggestions = Array.isArray(insights.suggestions)
    ? insights.suggestions.map((s, i) => `${i + 1}. ${s}`).join('\n')
    : insights.suggestions || '';

  const message = `🤖 *AI Business Insights Report*

📊 *Executive Summary*
${insights.summary || ''}

💡 *Business Suggestions*
${suggestions}

📈 *Sales Analysis*
${insights.salesAnalysis || ''}

🏆 *Product Performance*
${insights.productInsights || ''}

🔮 *Predictions*
${insights.predictions || ''}

Generated: ${new Date().toLocaleString()}`;

  await sendWhatsApp(message);
};

module.exports = { sendOrderNotification, sendAIInsights };
