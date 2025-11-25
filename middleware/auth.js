const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async(req, res, next) => {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: "Unauthorized" });
  const token = header.split(" ")[1];
  const payload = jwt.verify(token, process.env.JWT_SECRET);
  req.user = await User.findById(payload.id);
  next();
};
