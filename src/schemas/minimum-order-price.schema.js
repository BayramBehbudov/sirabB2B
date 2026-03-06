import z from "zod";
import { NullableSchemaId, RequiredSchemaId, RequiredSchemaNumber, SpecodeSchema } from "./shared.schema";


export const MinOrderPriceSchema = z.object({
    id: RequiredSchemaId,
    orderPrice: RequiredSchemaNumber,
    customerGroupId: NullableSchemaId,
    b2BCustomerId: NullableSchemaId,
    clSpecode: SpecodeSchema,
    clSpecode1: SpecodeSchema,
    clSpecode2: SpecodeSchema,
    clSpecode3: SpecodeSchema,
    clSpecode4: SpecodeSchema,
    clSpecode5: SpecodeSchema,
    b2BCustomerType: SpecodeSchema,
});
