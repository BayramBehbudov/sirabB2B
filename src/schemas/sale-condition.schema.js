import { z } from "zod";
import { RequiredSchemaId, RequiredSchemaNumber } from "./shared.schema";

export const SaleConditionLineSchema = z.object({
    price: RequiredSchemaNumber,
    isVAT: z.boolean(),
    productId: RequiredSchemaId,
});


export const SaleConditionSchema = z.object({
    customerGroupIds: z
        .array(z.number({ message: "errors.customerOrGroupRequired" })),
    b2BCustomerIds: z
        .array(z.number({ message: "errors.customerOrGroupRequired" })),
    sendToAllCustomers: z.boolean({ message: "errors.customerTypeRequired" }),
    startDate: z.string({ message: "errors.invalidDate" }).nonempty({ error: "errors.startDateRequired" }),
    endDate: z.string({ message: "errors.invalidDate" }).nonempty({ error: "errors.endDateRequired" }),
    description: z
        .string({ message: "errors.descriptionRequired" })
        .min(1, { message: "errors.descriptionRequired" }),


    saleConditionLines: z
        .array(SaleConditionLineSchema)
        .nonempty({ message: "errors.required" }),
})


