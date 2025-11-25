const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  currency: { type: String, default: 'INR' },
  donor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String },
  paymentProvider: { type: String, enum: ['stripe', 'razorpay'], required: true },
  providerPaymentId: { type: String },
  status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' }
}, { timestamps: true });

module.exports = mongoose.model('Donation', donationSchema);
