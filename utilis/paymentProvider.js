const Stripe = require('stripe');
const Razorpay = require('razorpay');

const stripeSecret = process.env.STRIPE_SECRET_KEY;
const stripe = stripeSecret ? new Stripe(stripeSecret) : null;

const razorpayKeyId = process.env.RAZORPAY_KEY_ID;
const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;
const razorpay = (razorpayKeyId && razorpayKeySecret)
  ? new Razorpay({ key_id: razorpayKeyId, key_secret: razorpayKeySecret })
  : null;

/**
 * amount is expected in major currency units (e.g. 100.50 INR)
 */
async function createPayment({ amount, currency = 'INR', provider = 'stripe', metadata = {} }) {
  const amountInMinor = Math.round(amount * 100);

  if (provider === 'stripe') {
    if (!stripe) throw new Error('Stripe not configured');
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInMinor,
      currency: currency.toLowerCase(),
      metadata
    });
    return {
      provider: 'stripe',
      providerPaymentId: paymentIntent.id,
      clientSecret: paymentIntent.client_secret
    };
  }

  if (provider === 'razorpay') {
    if (!razorpay) throw new Error('Razorpay not configured');
    const order = await razorpay.orders.create({
      amount: amountInMinor,
      currency,
      notes: metadata
    });
    return {
      provider: 'razorpay',
      providerPaymentId: order.id
    };
  }

  throw new Error('Unsupported provider');
}

module.exports = {
  createPayment
};
