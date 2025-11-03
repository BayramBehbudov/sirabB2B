import { z } from "zod";

export const BannerImageSchema = z.object({
    fileName: z
        .string({ message: "errors.required" })
        .min(1, { message: "errors.required" }),
    base64: z
        .string({ message: "errors.required" })
        .min(1, { message: "errors.required" }),
    bannerId: z.number({ message: "errors.required" }),
});

export const BannerSchema = z.object({
    isGlobal: z.boolean({ message: "errors.customerTypeRequired" }),
    title: z
        .string({ message: "errors.titleRequired" })
        .min(1, { message: "errors.titleRequired" }),
    description: z
        .string({ message: "errors.descriptionRequired" })
        .min(1, { message: "errors.descriptionRequired" }),
    startDate: z.iso.datetime({ message: "errors.invalidDate" }).nonempty({ error: "errors.startDateRequired" }),
    endDate: z.iso.datetime({ message: "errors.invalidDate" }).nonempty({ error: "errors.endDateRequired" }),
    b2BCustomerIds: z
        .array(z.number({ message: "errors.customerRequired" })),
    bannerImageDtos: z
        .array(BannerImageSchema)
        .nonempty({ message: "errors.required" }),
})
    .refine((data) => {
        if (data.isGlobal) {
            return data.b2BCustomerIds.length === 0;
        } else {
            return data.b2BCustomerIds.length > 0;
        }
    }, {
        path: ['b2BCustomerIds'],
        message: 'errors.customerRequired',
    });
