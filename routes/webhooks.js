const express = require('express');
const Donation = require('../models/Donation');
const Stripe = require('stripe');

const router = express.Router();

// Stripe webhook (raw body is needed in real setup)
// Here we keep it simple and assume verified
router.post('/stripe', express.json(), async (req, res) => {
  const event = req.body;

  try {
    if (event.type === 'payment_intent.succeeded') {
      const intent = event.data.object;
      const donationId = intent.metadata && intent.metadata.donationId;
      if (donationId) {
        await Donation.findByIdAndUpdate(donationId, { status: 'completed' });
      }
    }

    if (event.type === 'payment_intent.payment_failed') {
      const intent = event.data.object;
      const donationId = intent.metadata && intent.metadata.donationId;
      if (donationId) {
        await Donation.findByIdAndUpdate(donationId, { status: 'failed' });
      }
    }

    res.json({ received: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Webhook error' });
  }
});

// Razorpay webhook (simplified)
router.post('/razorpay', express.json(), async (req, res) => {
  try {
    const payload = req.body;
    const notes = payload.payload && payload.payload.payment && payload.payload.payment.entity && payload.payload.payment.entity.notes;
    const status = payload.event && payload.event.includes('payment.captured') ? 'completed' : 'failed';
    const donationId = notes && notes.donationId;

    if (donationId) {
      await Donation.findByIdAndUpdate(donationId, { status });
    }

    res.json({ received: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Webhook error' });
  }
});

module.exports = router;
