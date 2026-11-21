const prisma = require('../config/db');
const AppError = require('../utils/AppError');
const jwt = require('jsonwebtoken');


const switchUserRole = async (userId, targetRoleId) => {
  const existingRole = await prisma.uSER_ROLE.findFirst({
    where: {
      UserId: userId,
      RoleId: targetRoleId,
    },
    select: {
      UserRoleStatus: true,
      UserRoleActiveNow: true,
      UserRoleId: true,
    },
  });

  if (!existingRole) {
    throw new AppError('You do not have permission for this role', 403);
  }

  if (existingRole.UserRoleStatus !== 'ACTIVE') {
    throw new AppError('This role is currently deactivated for your account', 403);
  }

  if (existingRole.UserRoleActiveNow === true) {
    throw new AppError('This role is already active', 400);
  }

  const update = await prisma.$transaction(async (tx) => {
    await tx.uSER_ROLE.updateMany({
      where: { UserId: userId, UserRoleActiveNow: true },
      data: {
        UserRoleActiveNow: false,
      },
    });

    const activatedRole = await tx.uSER_ROLE.update({
      where: { UserRoleId: existingRole.UserRoleId },
      data: {
        UserRoleActiveNow: true,
      },
      include: { ROLES: true },
    });

    return activatedRole;
  });

  const JWTtoken = jwt.sign(
    {
      userId: userId.toString(),
      role: update.ROLES.RoleName,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    }
  );

  const newRoleName = update.ROLES.RoleName;

  return {
    JWTtoken,
    newRoleName,
  };
};

// ============================================================================
// GET USER ROLES
// ============================================================================
const getUserRoles = async (userId) => {
  const userRoles = await prisma.uSER_ROLE.findMany({
    where: {
      UserId: userId,
    },
    select: {
      ROLES: {
        select: {
          RoleName: true,
        },
      },
      UserRoleStatus: true,
      UserRoleActiveNow: true,
      RoleId: true,
    },
  });

  return userRoles.map((role) => {
    return {
      roleId: role.RoleId,
      roleName: role.ROLES.RoleName,
      status: role.UserRoleStatus,
      isActiveNow: role.UserRoleActiveNow,
    };
  });
};
// ============================================================================
// UPDATE USER ACCOUNT STATUS
// ============================================================================
const updateUserAccountStatus = async (
  userId,
  { accountStatus, deletionReason, deletionTextReason }
) => {
  const accStatus = await prisma.uSERS.findUnique({
    where: {
      UserId: userId,
    },
    select: {
      UserAccountStatus: true,
    },
  });

  if (accStatus === null) {
    throw new AppError('User not found', 404);
  }

  if (accStatus.UserAccountStatus === 'DELETED') {
    throw new AppError('This Account Already Deleted', 400);
  }

  if (accStatus.UserAccountStatus === 'PENDING' && accountStatus === 'ACTIVE') {
  throw new AppError('Cannot self-activate a pending account. Verification is required.', 403);
  }

  if (accStatus.UserAccountStatus === accountStatus) {
    throw new AppError(
      `This account is already in ${accountStatus} status`,
      400
    );
  }

  let newAccountStatus = {};
  if (accountStatus === 'DELETED') {
    newAccountStatus = {
      UserAccountStatus: accountStatus,
      UserDeletedAt: new Date(),
      UserDeletedAtReason: deletionReason,
      UserDeletedAtTextReason: deletionTextReason || null,
    };
  } else {
    newAccountStatus = {
      UserAccountStatus: accountStatus,
    };
  }

  const updatedAccStatus = await prisma.uSERS.update({
    where: {
      UserId: userId,
    },
    data: newAccountStatus,
    select: {
      UserId: true,
      UserAccountStatus: true,
      UserDeletedAt: true,
    },
  });

  return {
    userId: updatedAccStatus.UserId.toString(),
    accountStatus: updatedAccStatus.UserAccountStatus,
    deletedAt: updatedAccStatus.UserDeletedAt,
  };
};
// ============================================================================
const createBusinessProfile =async (userId, data) => {
const existingProfile = await prisma.bUSINESS_INFORMATION.findFirst({
  where: {
    USER_ROLE: {
      UserId: userId,
    },
  },
});
if (existingProfile) {throw new AppError('Business profile already exists for your account',409)}
const result = await prisma.$transaction(async (tx) => {
const sellerRole = await tx.rOLES.findUnique({
   where: { RoleName: 'SELLER' },
});
let userRole = await tx.uSER_ROLE.findFirst({
  where : {
    UserId : userId,
    RoleId :sellerRole.RoleId,
  },
});
if (!userRole) {
  userRole = await tx.uSER_ROLE.create({
    data : {
      UserId: userId,
      RoleId: sellerRole.RoleId,
      UserRoleStatus: 'UNDERREVIEW',
      UserRoleActiveNow: false,
    }
  });
}
const {
  BusinessInformationEmail,
  BusinessInformationPhoneNumber,
  ...infoData
} = data;
const newProfile = await tx.bUSINESS_INFORMATION.create({
  data: {
    UserRoleId: userRole.UserRoleId,
    ...infoData,
    BUSINESS_INFORMATION_EMAIL: {
      create: BusinessInformationEmail.map((email) => ({
        BusinessInformationEmail: email,
      })),
    },
    BUSINESS_INFORMATION_PHONENUMBER: {
      create: BusinessInformationPhoneNumber.map((phone) => ({
        BusinessInformationPhoneNumber: phone,
      })),
    },
  },
  include: {
    BUSINESS_INFORMATION_EMAIL: true,
    BUSINESS_INFORMATION_PHONENUMBER: true,
  },
});
return newProfile;

});
return result;
};
// ============================================================================
const getBusinessProfile = async (userId) => {
  const getBusinessProfileInfo =await prisma.bUSINESS_INFORMATION.findFirst({
    where:{USER_ROLE : {UserId : userId}},
    include : {
      BUSINESS_INFORMATION_EMAIL : true ,
      BUSINESS_INFORMATION_PHONENUMBER : true ,
    }
  });
  if(!getBusinessProfileInfo)
    {throw new AppError('No business profile found for this account', 404);}
  else { return getBusinessProfileInfo ;}
};
// ============================================================================
const updateBusinessProfile = async (userId,updateData) => {
  const getBusinessProfileInfo =await prisma.bUSINESS_INFORMATION.findFirst({
    where:{USER_ROLE : {UserId : userId}},
  });
  if(!getBusinessProfileInfo) {
    throw new AppError('No business profile found for this account', 404);
  }
  if (Object.keys(updateData).length === 0) {
    throw new AppError('Please provide at least one field to update', 400);
  }
  const result = await prisma.$transaction(async (tx) => {

     const updated = await tx.bUSINESS_INFORMATION.update({
     where: { BusinessInformationId: getBusinessProfileInfo.BusinessInformationId },
     data: updateData,
     include: { BUSINESS_INFORMATION_EMAIL: true, BUSINESS_INFORMATION_PHONENUMBER: true }
     })

    await tx.uSER_ROLE.update({
     where: { UserRoleId: getBusinessProfileInfo.UserRoleId },
     data: { UserRoleStatus: 'UNDERREVIEW' }
     })

    return updated;
  });
return result ;
};
// ============================================================================
// EXPORTS
// ============================================================================
module.exports = {
  switchUserRole,
  getUserRoles,
  updateUserAccountStatus,
  createBusinessProfile,
  getBusinessProfile,
  updateBusinessProfile,
};