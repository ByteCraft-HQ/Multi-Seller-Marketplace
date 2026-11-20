const { z } = require('zod');

// ============================================================================
// USER PROFILE UPDATE VALIDATION SCHEMA
// ============================================================================
const updateProfileSchema = z.object({
  userFirstName: z
    .string()
    .trim()
    .min(2, 'First name must be at least 2 characters long')
    .optional(),

  userMiddleName: z
    .string()
    .trim()
    .optional()
    .nullable(),

  userLastName: z
    .string()
    .trim()
    .min(2, 'Last name must be at least 2 characters long')
    .optional()
    .nullable(),

  userGender: z
    .enum(['MALE', 'FEMALE'], {
      message: 'Gender must be either MALE or FEMALE',
    })
    .optional()
    .nullable(),

  userBirthDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Birth date must be in YYYY-MM-DD format')
    .refine((dateStr) => new Date(dateStr) < new Date(), {
      message: 'Birth date must be in the past',
    })
    .optional()
    .nullable(),

  userRecoveryEmail: z
    .string()
    .trim()
    .email('Invalid recovery email format')
    .optional()
    .nullable(),
});

// ============================================================================
// ADD SECONDARY PHONE NUMBER VALIDATION SCHEMA
// ============================================================================
const addPhoneSchema = z.object({
  userPhoneNumber: z
    .string()
    .trim()
    .startsWith('+', 'Phone number must start with country code (+)')
    .min(8, 'Phone number must be at least 8 characters long')
    .max(25, 'Phone number cannot exceed 25 characters'),
});
// ============================================================================
// SWITCH USER ROLE VALIDATION SCHEMA
// ============================================================================
const switchRoleSchema = z.object({
  targetRoleId: z
    .number()
    .int()
    .positive()
    .max(255),
});

// ============================================================================
// UPDATE ACCOUNT STATUS VALIDATION SCHEMA
// ============================================================================
const updateAccountStatusSchema = z
  .object({
    accountStatus: z.enum(['ACTIVE', 'DEACTIVATED', 'DELETED']),
    deletionReason: z
      .enum([
        'NO_LONGER_USING_ACCOUNT',
        'FOUND_BETTER_ALTERNATIVE',
        'HIGH_PRICES',
        'DELIVERY_ISSUES',
        'PRODUCT_QUALITY_ISSUES',
        'POOR_CUSTOMER_SERVICE',
        'PRIVACY_CONCERNS',
        'HAS_ANOTHER_ACCOUNT',
        'OTHER',
      ])
      .optional(),
    deletionTextReason: z.string().trim().max(150).optional(),
  })
  .refine(
    (data) => {
      if (data.accountStatus === 'DELETED' && !data.deletionReason) {
        return false;
      }
      return true;
    },
    {
      message: 'Deletion reason is required',
      path: ['deletionReason'],
    }
  );
// ============================================================================
// CREATE BUSINESS PROFILE VALIDATION SCHEMA
// ============================================================================
const createBusinessProfileSchema = z.object({
  BusinessInformationBusinessType: z.enum([
    'COMPANY',
    'INDIVIDUAL',
    'STORE',
  ]),

  BusinessInformationBusinessCountry: z
    .string()
    .trim()
    .min(2, 'Country must be at least 2 characters long')
    .max(100),

  CompanyRegistrationNumber: z
    .string()
    .trim()
    .min(1, 'Company registration number is required')
    .max(50),

  BusinessInformationNationalId: z
    .string()
    .trim()
    .min(1, 'National ID is required')
    .max(50),

  BusinessInformationBirthCertificateImage: z
    .string()
    .trim()
    .min(1, 'Birth certificate image is required')
    .max(500),

  BusinessInformationNationalIdCardImage: z
    .string()
    .trim()
    .min(1, 'National ID card image is required')
    .max(500),

  BusinessInformationBusinessRegister: z
    .string()
    .trim()
    .min(1, 'Business register document is required')
    .max(500),

  BusinessInformationBusinessLegalName: z
    .string()
    .trim()
    .min(2, 'Legal name must be at least 2 characters long')
    .max(200),

  BusinessInformationBusinessPostalCode: z
    .string()
    .trim()
    .min(1, 'Postal code is required')
    .max(50),

  BusinessInformationEmail: z
    .array(
      z
        .string()
        .trim()
        .email('Invalid email address format')
    )
    .min(1, 'At least one business email is required'),

  BusinessInformationPhoneNumber: z
    .array(
      z
        .string()
        .trim()
        .startsWith('+', 'Phone number must start with country code (+)')
        .min(8, 'Phone number must be at least 8 characters long')
        .max(25, 'Phone number cannot exceed 25 characters')
    )
    .min(1, 'At least one business phone number is required'),
});
// ============================================================================
// UPDATE BUSINESS PROFILE VALIDATION SCHEMA
// ============================================================================
const updateBusinessProfileSchema = z.object({
  BusinessInformationBusinessType: z
    .enum(['COMPANY', 'INDIVIDUAL', 'STORE'], {
      message: 'Business type must be COMPANY, INDIVIDUAL, or STORE',
    })
    .optional(),

  BusinessInformationBusinessCountry: z
    .string()
    .trim()
    .min(2, 'Country must be at least 2 characters long')
    .max(100, 'Country cannot exceed 100 characters')
    .optional(),

  CompanyRegistrationNumber: z
    .string()
    .trim()
    .min(1, 'Company registration number cannot be empty')
    .max(50, 'Company registration number cannot exceed 50 characters')
    .optional(),

  BusinessInformationNationalId: z
    .string()
    .trim()
    .min(1, 'National ID cannot be empty')
    .max(50, 'National ID cannot exceed 50 characters')
    .optional(),

  BusinessInformationBirthCertificateImage: z
    .string()
    .trim()
    .min(1, 'Birth certificate image cannot be empty')
    .max(500, 'Image URL cannot exceed 500 characters')
    .optional(),

  BusinessInformationNationalIdCardImage: z
    .string()
    .trim()
    .min(1, 'National ID card image cannot be empty')
    .max(500, 'Image URL cannot exceed 500 characters')
    .optional(),

  BusinessInformationBusinessRegister: z
    .string()
    .trim()
    .min(1, 'Business register document cannot be empty')
    .max(500, 'Document URL cannot exceed 500 characters')
    .optional(),

  BusinessInformationBusinessLegalName: z
    .string()
    .trim()
    .min(2, 'Legal name must be at least 2 characters long')
    .max(200, 'Legal name cannot exceed 200 characters')
    .optional(),

  BusinessInformationBusinessPostalCode: z
    .string()
    .trim()
    .min(1, 'Postal code cannot be empty')
    .max(50, 'Postal code cannot exceed 50 characters')
    .optional(),
});

// ============================================================================
// EXPORTS
// ============================================================================
module.exports = {
  updateProfileSchema,
  addPhoneSchema,
  switchRoleSchema,
  updateAccountStatusSchema,
  createBusinessProfileSchema,
  updateBusinessProfileSchema,
};
