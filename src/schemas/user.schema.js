import z from "zod";
import { EmailSchema, PasswordSchemaControl, PhoneSchema, RequiredSchemaId, RequiredSchemaMin2, RequiredSchemaMin3, PhoneSchemaOptional, OptionalStrSchema, SpecodeSchema } from "./shared.schema";

export const DeliveryAddressesSchema = z.object({
    deliveryAddressId: RequiredSchemaId,
    title: RequiredSchemaMin3,
    addressLine: RequiredSchemaMin3,
    city: RequiredSchemaMin3,
    district: RequiredSchemaMin3,
    postalCode: RequiredSchemaMin3,
    isDefault: z.boolean({ error: "errors.required" }).default(false),
    loc_X: RequiredSchemaId,
    loc_Y: RequiredSchemaId,
    phoneNumber1: PhoneSchema,
    phoneNumber2: PhoneSchemaOptional
});
export const CustomerSchema =
    z.object({
        customerGroupId: z.number({ error: "errors.required" }),
        erpId: OptionalStrSchema,
        taxId: z.string().optional().refine((val) => !val || /^\d{10}$/.test(val), { message: "errors.invalidTAX" }),
        phoneNumber: PhoneSchema,
        email: EmailSchema,
        contactPersonFirstName: RequiredSchemaMin3,
        contactPersonLastName: RequiredSchemaMin3,
        companyName: OptionalStrSchema,
        profileImageFileName: z.string().default("").optional(),
        profileImageBase64: z.string().default("").optional(),
        deliveryAddresses: z.array(DeliveryAddressesSchema),
        clSpecode: SpecodeSchema,
        clSpecode1: SpecodeSchema,
        clSpecode2: SpecodeSchema,
        clSpecode3: SpecodeSchema,
        clSpecode4: SpecodeSchema,
        clSpecode5: SpecodeSchema,
        b2BCustomerType: SpecodeSchema,
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
