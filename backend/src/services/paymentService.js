// Mock Stripe-like service (no real charge)

function createCheckoutSession({ items, amount, currency = 'usd' }) {
  const id = `cs_test_${Math.random().toString(36).slice(2, 10)}`;
  return {
    id,
    url: `https://mock.stripe.test/checkout/${id}`,
    amount,
    currency,
    items,
  };
}

function retrieveSession(id) {
  // Always succeed in mock
  return { id, payment_status: 'paid' };
}

module.exports = { createCheckoutSession, retrieveSession };


