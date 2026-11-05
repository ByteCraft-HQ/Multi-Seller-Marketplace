const express = require('express');
const router = express.Router();

// 1. استدعاء الكنترولر
const authController = require('../controllers/authController');

// 2. استدعاء ضابط الفحص وقانون التسجيل
const validate = require('../middlewares/validate');
const { registerSchema } = require('../validations/authValidation');

// 3. تعريف المسار: لاحظ الترتيب من اليسار لليمين!
router.post('/register', validate(registerSchema), authController.register);

module.exports = router;