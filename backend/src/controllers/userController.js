const prisma = require('../config/db');
const AppError = require('../utils/AppError');

// ============================================================================
// GET USER PROFILE CONTROLLER
// ============================================================================
const getProfile = async (req, res, next) => {
  try {
    // ------------------------------------------------------------------------
    // 1. Fetch User with Phone Numbers and Active Role
    // ------------------------------------------------------------------------
    const user = await prisma.uSERS.findUnique({
      where: { UserId: req.user.UserId },
      include: {
        USERPHONENUMBER: true,
        USER_ROLE: {
          where: { UserRoleActiveNow: true },
          include: { ROLES: true },
        },
      },
    });

    if (!user) {
      return next(new AppError('User not found', 404));
    }

    // ------------------------------------------------------------------------
    // 2. Extract Active Role
    // ------------------------------------------------------------------------
    const activeRole = user.USER_ROLE[0]?.ROLES?.RoleName || 'CUSTOMER';

    // ------------------------------------------------------------------------
    // 3. Send Response (Without Password Hash)
    // ------------------------------------------------------------------------
    res.status(200).json({
      status: 'success',
      data: {
        user: {
          userId: user.UserId.toString(),
          firstName: user.UserFirstName,
          middleName: user.UserMiddleName,
          lastName: user.UserLastName,
          email: user.UserEmail,
          phoneNumbers: user.USERPHONENUMBER,
          role: activeRole,
          gender: user.UserGender,
          birthDate: user.UserBirthDate,
          recoveryEmail: user.UserRecoveryEmail,
          accountStatus: user.UserAccountStatus,
          createdAt: user.UserCreatedAt,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================================
// UPDATE USER PROFILE CONTROLLER
// ============================================================================
const updateProfile = async (req, res, next) => {
  try {
    const {
      userFirstName,
      userMiddleName,
      userLastName,
      userGender,
      userBirthDate,
      userRecoveryEmail,
    } = req.body;

    // ------------------------------------------------------------------------
    // 1. Constraint Guard: Recovery email cannot equal primary email
    // ------------------------------------------------------------------------
    if (
      userRecoveryEmail &&
      userRecoveryEmail.toLowerCase() === req.user.UserEmail.toLowerCase()
    ) {
      return next(
        new AppError('Recovery email cannot be the same as your primary email', 400)
      );
    }

    // ------------------------------------------------------------------------
    // 2. Prepare Update Payload (Apply lowercase formatting per database rules)
    // ------------------------------------------------------------------------
    const updateData = {};

    if (userFirstName !== undefined) {
      updateData.UserFirstName = userFirstName.trim().toLowerCase();
    }

    if (userMiddleName !== undefined) {
      updateData.UserMiddleName = userMiddleName ? userMiddleName.trim().toLowerCase() : null;
    }

    if (userLastName !== undefined) {
      updateData.UserLastName = userLastName ? userLastName.trim().toLowerCase() : null;
    }

    if (userGender !== undefined) {
      updateData.UserGender = userGender;
    }

    if (userBirthDate !== undefined) {
      updateData.UserBirthDate = userBirthDate ? new Date(userBirthDate) : null;
    }

    // Enforce conditional nullability rule for Recovery Email
    if (userRecoveryEmail !== undefined) {
      if (!userRecoveryEmail) {
        updateData.UserRecoveryEmail = null;
        updateData.UserRecoveryEmailVerification = null;
      } else {
        updateData.UserRecoveryEmail = userRecoveryEmail.trim().toLowerCase();
        updateData.UserRecoveryEmailVerification = false;
      }
    }

    // ------------------------------------------------------------------------
    // 3. Execute Database Update
    // ------------------------------------------------------------------------
    const updatedUser = await prisma.uSERS.update({
      where: { UserId: req.user.UserId },
      data: updateData,
      include: {
        USERPHONENUMBER: true,
        USER_ROLE: {
          where: { UserRoleActiveNow: true },
          include: { ROLES: true },
        },
      },
    });

    const activeRole = updatedUser.USER_ROLE[0]?.ROLES?.RoleName || 'CUSTOMER';

    // ------------------------------------------------------------------------
    // 4. Send Response
    // ------------------------------------------------------------------------
    res.status(200).json({
      status: 'success',
      message: 'Profile updated successfully',
      data: {
        user: {
          userId: updatedUser.UserId.toString(),
          firstName: updatedUser.UserFirstName,
          middleName: updatedUser.UserMiddleName,
          lastName: updatedUser.UserLastName,
          email: updatedUser.UserEmail,
          phoneNumbers: updatedUser.USERPHONENUMBER,
          role: activeRole,
          gender: updatedUser.UserGender,
          birthDate: updatedUser.UserBirthDate,
          recoveryEmail: updatedUser.UserRecoveryEmail,
          recoveryEmailVerification: updatedUser.UserRecoveryEmailVerification,
          accountStatus: updatedUser.UserAccountStatus,
          createdAt: updatedUser.UserCreatedAt,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================================
// ADD SECONDARY PHONE NUMBER CONTROLLER
// ============================================================================
const addPhone = async (req, res, next) => {
  try {
    const { userPhoneNumber } = req.body;

    // ------------------------------------------------------------------------
    // 1. Check if Phone Number already exists globally
    // ------------------------------------------------------------------------
    const existingPhone = await prisma.uSERPHONENUMBER.findUnique({
      where: { UserPhoneNumber: userPhoneNumber },
    });

    if (existingPhone) {
      return next(new AppError('This phone number is already registered', 409));
    }

    // ------------------------------------------------------------------------
    // 2. Insert Secondary Phone Number
    // ------------------------------------------------------------------------
    const newPhone = await prisma.uSERPHONENUMBER.create({
      data: {
        UserId: req.user.UserId,
        UserPhoneNumber: userPhoneNumber,
        UserPhoneNumberStatus: 'PENDING',
        UserPhoneNumberVerification: false,
      },
    });

    res.status(201).json({
      status: 'success',
      message: 'Phone number added successfully',
      data: {
        phone: newPhone,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================================
// DELETE PHONE NUMBER CONTROLLER
// ============================================================================
const deletePhone = async (req, res, next) => {
  try {
    const { phoneNumber } = req.params;

    // ------------------------------------------------------------------------
    // 1. Verify Phone exists and belongs to current user
    // ------------------------------------------------------------------------
    const phoneRecord = await prisma.uSERPHONENUMBER.findUnique({
      where: { UserPhoneNumber: phoneNumber },
    });

    if (!phoneRecord || phoneRecord.UserId !== req.user.UserId) {
      return next(new AppError('Phone number not found on your account', 404));
    }

    // ------------------------------------------------------------------------
    // 2. Business Rule: User MUST maintain at least ONE phone number
    // ------------------------------------------------------------------------
    const totalPhones = await prisma.uSERPHONENUMBER.count({
      where: { UserId: req.user.UserId },
    });

    if (totalPhones <= 1) {
      return next(
        new AppError(
          'Cannot delete your only phone number. You must maintain at least one phone number on your account.',
          400
        )
      );
    }

    // ------------------------------------------------------------------------
    // 3. Delete Phone Number
    // ------------------------------------------------------------------------
    await prisma.uSERPHONENUMBER.delete({
      where: { UserPhoneNumber: phoneNumber },
    });

    res.status(200).json({
      status: 'success',
      message: 'Phone number deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================================
// EXPORTS
// ============================================================================
module.exports = {
  getProfile,
  updateProfile,
  addPhone,
  deletePhone,
};
