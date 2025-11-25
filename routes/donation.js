const express = require('express');
const Donation = require('../models/Donation');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/', auth, async(req, res) => {
  const { amount, currency, message } = req.body;
  const donation = await Donation.create({
    amount,
    currency,
    donor: req.user._id,
    message
  });
  res.json(donation);
});

router.get('/', auth, async(req, res) => {
  const list = await Donation.find({ donor: req.user._id });
  res.json(list);
});

module.exports = router;
