// const jwt = require('jsonwebtoken');
// const User = require('../models/User');
// const JWT_SECRET = process.env.JWT_SECRET;

// module.exports = async function (req, res, next) {
//   const authHeader = req.headers.authorization;
//   if (!authHeader || !authHeader.startsWith('Bearer ')) return res.status(401).json({ message: 'No token' });
//   const token = authHeader.split(' ')[1];
//   try {
//     const payload = jwt.verify(token, JWT_SECRET);
//     req.user = await User.findById(payload.id).select('-password');
//     next();
//   } catch (err) {
//     return res.status(401).json({ message: 'Token invalid' });
//   }
// };

// const jwt = require('jsonwebtoken');
// const User = require('../models/User');
// const JWT_SECRET = process.env.JWT_SECRET;

// module.exports = async function(req, res, next) {
//   const authHeader = req.headers.authorization;
//   if (!authHeader || !authHeader.startsWith('Bearer '))
//     return res.status(401).json({ message: 'No token' });

//   const token = authHeader.split(' ')[1];
//   try {
//     const payload = jwt.verify(token, JWT_SECRET);
//     req.user = await User.findById(payload.id).select('-password');
//     if (!req.user) return res.status(401).json({ message: 'User not found' });
//     next();
//   } catch (err) {
//     return res.status(401).json({ message: 'Token invalid', error: err.message });
//   }
// };

const jwt = require("jsonwebtoken");
const User = require("../models/User");
const JWT_SECRET = process.env.JWT_SECRET;

module.exports = async function (req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = await User.findById(payload.id).select("-password");
    if (!req.user) return res.status(401).json({ message: "User not found" });
    next();
  } catch (err) {
    return res
      .status(401)
      .json({ message: "Token invalid", error: err.message });
  }
};
