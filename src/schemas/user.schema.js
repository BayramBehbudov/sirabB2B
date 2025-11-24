import z from "zod";
import { EmailSchema, PasswordSchemaControl, PhoneSchema, RequiredSchemaMin2, RequiredSchemaMin3 } from "./shared.schema";

export const CustomerSchema =
    z.object({
        customerGroupId: z.number({ error: "errors.required" }),
        erpId: RequiredSchemaMin2,
        taxId: z.string().nonempty("errors.required").regex(/^\d{10}$/, "errors.invalidTAX"),
        phoneNumber: PhoneSchema,
        email: EmailSchema,
        contactPersonFirstName: RequiredSchemaMin3,
        contactPersonLastName: RequiredSchemaMin3,
        companyName: RequiredSchemaMin3,
    });


export const PasswordSchema = z.object({
    password: PasswordSchemaControl,
})

export const EmptySchema = z.object({})

export const UserSchema = z.object({
    username: RequiredSchemaMin3,
    phoneNumber: PhoneSchema,
    password: PasswordSchemaControl,
    confirmPassword: PasswordSchemaControl,
    isActive: z.boolean({ error: "errors.required" }).default(true),
    isWebLogin: z.boolean({ error: "errors.required" }).default(false),
    isMobileLogin: z.boolean({ error: "errors.required" }).default(false),
}).refine((data) => data.password === data.confirmPassword, {
    message: "errors.passwordsDoNotMatch",
    path: ["confirmPassword"],
})


export const UserUpdateSchema = z.object({
    username: RequiredSchemaMin3,
    phoneNumber: PhoneSchema,
    isActive: z.boolean({ error: "errors.required" }).default(true),
    isWebLogin: z.boolean({ error: "errors.required" }).default(false),
    isMobileLogin: z.boolean({ error: "errors.required" }).default(false),
})
