const express = require('express');
const auth = require('../middleware/auth');
const Donation = require('../models/Donation');
const { createPayment } = require('../utils/paymentProvider');

const router = express.Router();

// Create donation and initiate payment
router.post('/', auth, async (req, res, next) => {
  try {
    const { amount, currency = 'INR', message, provider = 'stripe' } = req.body;
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    // Create pending donation
    const donation = await Donation.create({
      amount,
      currency,
      donor: req.user._id,
      message,
      paymentProvider: provider,
      status: 'pending'
    });

    const payment = await createPayment({
      amount,
      currency,
      provider,
      metadata: { donationId: donation._id.toString(), userId: req.user._id.toString() }
    });

    donation.providerPaymentId = payment.providerPaymentId;
    await donation.save();

    res.json({ donation, payment });
  } catch (err) {
    next(err);
  }
});

// Get donations for logged in user
router.get('/', auth, async (req, res, next) => {
  try {
    const donations = await Donation.find({ donor: req.user._id }).sort({ createdAt: -1 });
    res.json({ donations });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
