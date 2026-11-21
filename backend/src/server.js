require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 5000;

const requiredEnv = ['JWT_SECRET', 'JWT_EXPIRES_IN', 'DATABASE_URL'];
const missingEnv = requiredEnv.filter((env) => !process.env[env]);

if (missingEnv.length > 0) {
  console.error(`FATAL ERROR: Missing required environment variables: ${missingEnv.join(', ')}`);
  process.exit(1);
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
