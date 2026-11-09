const prisma = require('../config/db');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppError');

const protect = async (req, res, next) => { 
let token;

if (
  req.headers.authorization &&
  req.headers.authorization.startsWith('Bearer')
) {
  token = req.headers.authorization.split(' ')[1];
}

if (!token) {
  return next(new AppError('You are not logged in. Please log in to get access.', 401));
}

let decoded;
try {
  decoded = jwt.verify(token, process.env.JWT_SECRET);
} catch (error) {
  if (error.name === 'TokenExpiredError') {
    return next(new AppError('Your session has expired. Please log in again.', 401));
  }
  return next(new AppError('Invalid token. Please log in again.', 401));
}

const currentUser = await prisma.uSERS.findUnique({
  where: { UserId: BigInt(decoded.userId) }
});

if (!currentUser) {
  return next(new AppError('The user belonging to this token no longer exists.', 401));
}

if (['BLOCKED', 'DELETED', 'SUSPENDED'].includes(currentUser.UserAccountStatus)) {
  return next(new AppError('Your account is inactive or blocked.', 403));
}

req.user = currentUser; 
next();                 
}

module.exports = { protect };