import z from "zod";

export const phoneRegex = /^\+994\d{9,}$/;

export const PasswordSchemaControl = z
    .string({ error: "errors.required" })
// .trim()
// .min(8, { message: "errors.min8Chars" })
// .nonempty("errors.passwordRequired")
// .regex(/[A-Z]/, { message: "errors.errPassUp" })
// .regex(/[a-z]/, { message: "errors.errPassLow" })
// .regex(/[0-9]/, { message: "errors.errPassNum" })
// .regex(/[!@#$%^&*(),.?":{}|<>_\-+=/\\[\]`~]/, { message: "errors.errPassSym" })
// .regex(/^\S*$/, { message: "errors.errPassTrim" });

export const PhoneSchema = z
    .string({ error: "errors.required" })
    .regex(phoneRegex, { error: "errors.enterValidPhone" })
    .nonempty({ error: "errors.required" })

export const EmailSchema = z
    .email({ error: "errors.emailInvalid" })
    .nonempty({ error: "errors.emailRequired" })

export const RequiredSchemaMin3 = z.string({ error: "errors.required" }).nonempty({ error: "errors.required" }).min(3, { error: 'errors.min3Chars' })
export const RequiredSchemaMin2 = z.string({ error: "errors.required" }).nonempty({ error: "errors.required" }).min(2, { error: 'errors.min2Chars' })
export const RequiredSchemaMin1 = z.string({ error: "errors.required" }).nonempty({ error: "errors.required" }).min(1, { error: 'errors.min1Chars' })

export const RequiredSchemaIntNumber = z.number({ error: "errors.required" }).nonnegative({ error: "errors.invalidNumber" }).int({ error: "errors.invalidNumber" }).min(1, { error: 'errors.required' })
export const RequiredSchemaNumber = z.number({ error: "errors.required" }).nonnegative({ error: "errors.invalidNumber" }).min(0.01, { error: 'errors.required' })