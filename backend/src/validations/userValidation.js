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
// EXPORTS
// ============================================================================
module.exports = {
  updateProfileSchema,
  addPhoneSchema,
};
