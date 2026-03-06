import { z } from "zod";
import { NullableSchemaId, RequiredSchemaId, SpecodeSchema } from "./shared.schema";

export const BannerImageSchema = z.object({
    fileName: z
        .string({ message: "errors.required" })
        .min(1, { message: "errors.required" }),
    base64: z
        .string({ message: "errors.required" })
        .min(1, { message: "errors.required" }),
    id: RequiredSchemaId,
});

export const BannerSchema = z.object({
    title: z.string().default(''),
    description: z.string().default(''),
    startDate: z.string({ message: "errors.invalidDate" }).nonempty({ error: "errors.startDateRequired" }),
    endDate: z.string({ message: "errors.invalidDate" }).nonempty({ error: "errors.endDateRequired" }),
    bannerImageDtos: z
        .array(BannerImageSchema)
        .nonempty({ message: "errors.required" }),


    b2BCustomerGroupId: NullableSchemaId,
    b2BCustomerId: NullableSchemaId,
    clSpecode: SpecodeSchema,
    clSpecode1: SpecodeSchema,
    clSpecode2: SpecodeSchema,
    clSpecode3: SpecodeSchema,
    clSpecode4: SpecodeSchema,
    clSpecode5: SpecodeSchema,
    b2BCustomerType: SpecodeSchema,
    isActive: z.boolean().default(true),

})
