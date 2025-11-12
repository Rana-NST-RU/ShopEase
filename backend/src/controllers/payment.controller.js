const { createCheckoutSession, retrieveSession } = require('../services/paymentService');

async function demoPayment(req, res) {
  const { orderId, amount } = req.body;
  
  if (!orderId || !amount) {
    return res.status(400).json({ error: 'Missing orderId or amount' });
  }

  // Create a mock checkout session
  const session = createCheckoutSession({
    items: [],
    amount: Math.round(amount * 100),
    currency: 'usd',
  });

  // Simulate payment success
  const paymentResult = retrieveSession(session.id);

  return res.json({
    success: true,
    sessionId: session.id,
    paymentStatus: paymentResult.payment_status,
    message: 'Payment simulation successful',
  });
}

module.exports = { demoPayment };

