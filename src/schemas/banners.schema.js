import { z } from "zod";
import { RequiredSchemaId } from "./shared.schema";

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
    sendToAllCustomers: z.boolean({ message: "errors.customerTypeRequired" }),
    title: z
        .string({ message: "errors.titleRequired" })
        .min(1, { message: "errors.titleRequired" }),
    description: z
        .string({ message: "errors.descriptionRequired" })
        .min(1, { message: "errors.descriptionRequired" }),
    startDate: z.string({ message: "errors.invalidDate" }).nonempty({ error: "errors.startDateRequired" }),
    endDate: z.string({ message: "errors.invalidDate" }).nonempty({ error: "errors.endDateRequired" }),
    b2BCustomerIds: z
        .array(z.number({ message: "errors.customerOrGroupRequired" })),
    b2BCustomerGroupIds: z
        .array(z.number({ message: "errors.customerOrGroupRequired" })),
    bannerImageDtos: z
        .array(BannerImageSchema)
        .nonempty({ message: "errors.required" }),
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

