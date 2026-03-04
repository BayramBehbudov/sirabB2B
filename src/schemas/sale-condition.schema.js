import { z } from "zod";
import { NullableSchemaId, RequiredSchemaId, RequiredSchemaNumber, SpecodeSchema } from "./shared.schema";

export const SaleConditionLineSchema = z.object({
    id: RequiredSchemaId,
    price: RequiredSchemaNumber,
    isVAT: z.boolean(),
    productId: RequiredSchemaId,
});


export const SaleConditionSchema = z.object({
    b2BCustomerGroupId: NullableSchemaId,
    b2BCustomerId: NullableSchemaId,
    startDate: z.string({ message: "errors.invalidDate" }).nonempty({ error: "errors.startDateRequired" }),
    endDate: z.string({ message: "errors.invalidDate" }).nonempty({ error: "errors.endDateRequired" }),
    description: z.string().default(''),
    saleConditionLines: z
        .array(SaleConditionLineSchema)
        .nonempty({ message: "errors.required" }),
    clSpecode: SpecodeSchema,
    clSpecode1: SpecodeSchema,
    clSpecode2: SpecodeSchema,
    clSpecode3: SpecodeSchema,
    clSpecode4: SpecodeSchema,
    clSpecode5: SpecodeSchema,
    b2BCustomerType: SpecodeSchema,
    isActive: z.boolean().default(true),
})