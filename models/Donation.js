const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  amount: Number,
  currency: String,
  donor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  message: String,
  status: { type: String, default: 'pending' }
}, { timestamps: true });

module.exports = mongoose.model('Donation', donationSchema);
