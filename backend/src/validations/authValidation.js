   const { z } = require('zod');

   const registerSchema = z.object ({
    userFirstName: z
    .string()
    .trim()
    .min(2, "First name must be at least 2 characters long"),

  userLastName: z
    .string()
    .trim()
    .min(2, "Last name must be at least 2 characters long"),

  userEmail: z
    .string()
    .trim()
    .email("Invalid email address format"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters long"),

  userPhoneNumber: z
    .string()
    .trim()
    .startsWith('+', "Phone number must start with country code (+)")
   });

   const loginSchema = z.object({ 
    userEmail: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Invalid email address format"),

  password: z
    .string()
    .min(1, "Password is required")

   });

    
   
   module.exports = { registerSchema ,loginSchema};