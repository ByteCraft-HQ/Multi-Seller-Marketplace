BigInt.prototype.toJSON = function () {
  return this.toString();
};

const express = require('express');
const cors = require('cors');
const prisma = require('./config/db');
const AppError = require('./utils/AppError');
const errorMiddleware = require('./middlewares/errorMiddleware');
const authRoutes = require('./routes/authRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);

app.get('/api/health', async (req, res) => {
  try {

    await prisma.$queryRaw`SELECT 1 as test;`;
    res.status(200).json({
      status: 'Success',
      message: ' Server is healthy & Database is CONNECTED successfully!',
    });
  } catch (error) {
    res.status(500).json({
      status: 'Error',
      message: 'Database connection failed',
      error: error.message,
    });
  }
});



app.use(errorMiddleware);
module.exports = app;