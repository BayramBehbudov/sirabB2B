import { z } from "zod";
import { RequiredSchemaId, RequiredSchemaNumber } from "./shared.schema";

export const DiscountConditionLineSchema = z.object({
    price: RequiredSchemaNumber,
    isVAT: z.boolean(),
    productId: RequiredSchemaId,
});


export const DiscountConditionSchema = z.object({
    b2BCustomerGroupIds: z
        .array(z.number({ message: "errors.customerOrGroupRequired" })),
    b2BCustomerIds: z
        .array(z.number({ message: "errors.customerOrGroupRequired" })),
    sendToAllCustomers: z.boolean({ message: "errors.customerTypeRequired" }),
    startDate: z.string({ message: "errors.invalidDate" }).nonempty({ error: "errors.startDateRequired" }),
    endDate: z.string({ message: "errors.invalidDate" }).nonempty({ error: "errors.endDateRequired" }),
    description: z
        .string({ message: "errors.descriptionRequired" })
        .min(1, { message: "errors.descriptionRequired" }),
    discountConditionLines: z
        .array(DiscountConditionLineSchema)
        .nonempty({ message: "errors.required" }),
}).refine((data) => {
    if (data.sendToAllCustomers) {
        return (
            data.b2BCustomerIds.length === 0 &&
            data.b2BCustomerGroupIds.length === 0
        );
    }

    return (
        data.b2BCustomerIds.length > 0 ||
        data.b2BCustomerGroupIds.length > 0
    );
}, {
    path: ['b2BCustomerIds'],
    message: 'errors.customerOrGroupRequired',
}).refine((data) => {
    if (data.sendToAllCustomers) {
        return (
            data.b2BCustomerIds.length === 0 &&
            data.b2BCustomerGroupIds.length === 0
        );
    }
    return (
        data.b2BCustomerIds.length > 0 ||
        data.b2BCustomerGroupIds.length > 0
    );
}, {
    path: ['b2BCustomerGroupIds'],
    message: 'errors.customerOrGroupRequired'
});


