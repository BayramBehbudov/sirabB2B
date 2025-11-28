import { z } from "zod";
import { RequiredSchemaIntNumber } from "./shared.schema";


export const InventoryRequirementSchema = z.object({
    sendToAllCustomers: z.boolean({ message: "errors.customerTypeRequired" }),
    description: z
        .string({ message: "errors.descriptionRequired" })
        .min(1, { message: "errors.descriptionRequired" }),
    b2BCustomerIds: z
        .array(z.number({ message: "errors.customerOrGroupRequired" })),
    b2BCustomerGroupIds: z
        .array(z.number({ message: "errors.customerOrGroupRequired" })),
    requiredPhotoCount: RequiredSchemaIntNumber
})
    .refine((data) => {
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

