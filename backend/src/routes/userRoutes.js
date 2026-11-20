const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');
const validate = require('../middlewares/validate');
const {
  updateProfileSchema,
  addPhoneSchema,
  switchRoleSchema,
  updateAccountStatusSchema,
  createBusinessProfileSchema,
  updateBusinessProfileSchema,
} = require('../validations/userValidation');

// ============================================================================
// USER PROFILE ROUTES
// ============================================================================

router.get('/profile', protect, userController.getProfile);
router.patch('/profile', protect, validate(updateProfileSchema), userController.updateProfile);
router.patch('/account-status', protect, validate(updateAccountStatusSchema), userController.updateAccountStatus);

// ============================================================================
// USER PHONE NUMBERS MANAGEMENT ROUTES
// ============================================================================

router.post('/phone', protect, validate(addPhoneSchema), userController.addPhone);
router.delete('/phone/:phoneNumber', protect, userController.deletePhone);

// ============================================================================
// USER ROLES MANAGEMENT ROUTES
// ============================================================================

router.patch('/switch-role', protect, validate(switchRoleSchema), userController.updateRole);
router.get('/roles', protect, userController.getUserRoles);
router.post('/business-profile',protect,validate(createBusinessProfileSchema),userController.createBusinessProfile);
router.get('/business-profile',protect,userController.getBusinessProfile);
router.patch('/business-profile', protect, validate(updateBusinessProfileSchema), userController.updateBusinessProfile);

module.exports = router;
