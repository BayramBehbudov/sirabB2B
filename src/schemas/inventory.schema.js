import { z } from "zod";
import { NullableSchemaId, RequiredSchemaIntNumber, SpecodeSchema } from "./shared.schema";

export const InventoryRequirementSchema = z.object({
    description: z.string().default(''),
    erpCode: z.string().default(''),
    serialCode: z.string().default(''),
    requiredPhotoCount: RequiredSchemaIntNumber,
    startDate: z.string({ message: "errors.invalidDate" }).nonempty({ error: "errors.startDateRequired" }),
    endDate: z.string({ message: "errors.invalidDate" }).nonempty({ error: "errors.endDateRequired" }),
    customerGroupId: NullableSchemaId,
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