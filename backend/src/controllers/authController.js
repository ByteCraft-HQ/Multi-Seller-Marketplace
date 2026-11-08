const prisma = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppError');

// ============================================================================
// REGISTER CONTROLLER
// ============================================================================
const register = async (req, res, next) => {
  try {
    const {
      userFirstName,
      userLastName,
      userEmail,
      password,
      userPhoneNumber,
    } = req.body;

    // ------------------------------------------------------------------------
    // 1. Check if Email or Phone Number already exists
    // ------------------------------------------------------------------------
    const existingUser = await prisma.uSERS.findUnique({
      where: { UserEmail: userEmail },
    });
    if (existingUser) {
      return next(new AppError('This Email Already Exist', 409));
    }

    const existingPhoneNumber = await prisma.uSERPHONENUMBER.findUnique({
      where: { UserPhoneNumber: userPhoneNumber },
    });
    if (existingPhoneNumber) {
      return next(new AppError('This Phone Number Already Exist', 409));
    }

    // ------------------------------------------------------------------------
    // 2. Hash Password
    // ------------------------------------------------------------------------
    const userHashPassword = await bcrypt.hash(password, 12);

    // ------------------------------------------------------------------------
    // 3. Database Transaction (Atomic creation of User, Phone, and Role)
    // ------------------------------------------------------------------------
    const result = await prisma.$transaction(async (tx) => {
      const customerRole = await tx.rOLES.findUnique({
        where: { RoleName: 'CUSTOMER' },
      });

      const newUser = await tx.uSERS.create({
        data: {
          UserFirstName: userFirstName,
          UserLastName: userLastName,
          UserEmail: userEmail,
          UserHashPassword: userHashPassword,
          UserAccountStatus: 'PENDING',
        },
      });

      await tx.uSERPHONENUMBER.create({
        data: {
          UserId: newUser.UserId,
          UserPhoneNumber: userPhoneNumber,
          UserPhoneNumberStatus: 'PENDING',
        },
      });

      await tx.uSER_ROLE.create({
        data: {
          UserId: newUser.UserId,
          RoleId: customerRole.RoleId,
          UserRoleStatus: 'ACTIVE',
          UserRoleActiveNow: true,
        },
      });

      return newUser;
    });

    // ------------------------------------------------------------------------
    // 4. Generate JWT Token
    // ------------------------------------------------------------------------
    const JWTtoken = await jwt.sign(
      {
        userId: result.UserId.toString(),
        role: 'CUSTOMER',
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN,
      }
    );

    // ------------------------------------------------------------------------
    // 5. Send Response
    // ------------------------------------------------------------------------
    res.status(201).json({
      status: 'success',
      message: 'Account created successfully',
      JWTtoken,
      data: {
        user: {
          userId: result.UserId.toString(),
          firstName: result.UserFirstName,
          lastName: result.UserLastName,
          email: result.UserEmail,
          accountStatus: result.UserAccountStatus,
          createdAt: result.UserCreatedAt,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================================
// LOGIN CONTROLLER
// ============================================================================
const login = async (req, res, next) => {
  try {
    const { userEmail, password } = req.body;

    // ------------------------------------------------------------------------
    // 1. Verify User existence
    // ------------------------------------------------------------------------
    const existingUser = await prisma.uSERS.findUnique({
      where: { UserEmail: userEmail },
    });

    if (!existingUser) {
      return next(new AppError('Invalid email or password', 401));
    }

    // ------------------------------------------------------------------------
    // 2. Verify Password
    // ------------------------------------------------------------------------
    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.UserHashPassword
    );

    if (!isPasswordValid) {
      return next(new AppError('Invalid email or password', 401));
    }

    // ------------------------------------------------------------------------
    // 3. Status Guard (Check if account is Blocked, Deleted, or Suspended)
    // ------------------------------------------------------------------------
    if (existingUser.UserAccountStatus === 'BLOCKED') {
      return next(
        new AppError('Your account has been blocked. Please contact support.', 403)
      );
    }

    if (existingUser.UserAccountStatus === 'DELETED') {
      return next(new AppError('This account has been deleted.', 403));
    }

    if (existingUser.UserAccountStatus === 'SUSPENDED') {
      return next(
        new AppError('Your account has been suspended. Please contact support.', 403)
      );
    }

    // ------------------------------------------------------------------------
    // 4. Fetch Active Role
    // ------------------------------------------------------------------------
    const userRole = await prisma.uSER_ROLE.findFirst({
      where: {
        UserId: existingUser.UserId,
        UserRoleActiveNow: true,
      },
      include: {
        ROLES: true,
      },
    });

    const activeRoleName = userRole?.ROLES?.RoleName || 'CUSTOMER';

    // ------------------------------------------------------------------------
    // 5. Generate JWT Token
    // ------------------------------------------------------------------------
    const JWTtoken = await jwt.sign(
      {
        userId: existingUser.UserId.toString(),
        role: activeRoleName,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN,
      }
    );

    // ------------------------------------------------------------------------
    // 6. Send Response
    // ------------------------------------------------------------------------
    res.status(200).json({
      status: 'success',
      message: 'Logged in successfully',
      JWTtoken,
      data: {
        user: {
          userId: existingUser.UserId.toString(),
          firstName: existingUser.UserFirstName,
          lastName: existingUser.UserLastName,
          email: existingUser.UserEmail,
          accountStatus: existingUser.UserAccountStatus,
          role: activeRoleName,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================================
// EXPORTS
// ============================================================================
module.exports = {
  register,
  login,
};
