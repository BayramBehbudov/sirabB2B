import z from "zod";
import { NullableSchemaId, RequiredSchemaId, SpecodeSchema } from "./shared.schema";

export const NotificationImageSchema = z.object({
    fileName: z
        .string({ message: "errors.required" })
        .min(1, { message: "errors.required" }),
    base64: z
        .string({ message: "errors.required" })
        .min(1, { message: "errors.required" }),
    id: RequiredSchemaId,
});



export const NotificationSchema =
    z.object({
        notificationTypeId: z.number({ error: "errors.notificationTypeRequired" }).min(1, { error: "errors.notificationTypeRequired" }),
        notificationTemplateId: z.number({ error: "errors.notificationTemplateRequired" }).min(1, { error: "errors.notificationTemplateRequired" }),
        scheduledAt: z.string({ message: "errors.invalidDate" }).nonempty({ error: "errors.sendDateRequired" }),
        images: z.array(NotificationImageSchema),
        customerGroupId: NullableSchemaId,
        b2BCustomerId: NullableSchemaId,
        clSpecode: SpecodeSchema,
        clSpecode1: SpecodeSchema,
        clSpecode2: SpecodeSchema,
        clSpecode3: SpecodeSchema,
        clSpecode4: SpecodeSchema,
        clSpecode5: SpecodeSchema,
        b2BCustomerType: SpecodeSchema,
    })


export const NotificationTypeSchema =
    z.object({
        name: z.string({ error: "errors.nameRequired" }).nonempty({ error: "errors.nameRequired" }),
        soundFileName: z.string({ error: "errors.addSoundName" }).nonempty({ error: "errors.addSoundName" }),
        iconFileName: z.string({ error: "errors.addIcon" }).nonempty({ error: "errors.addIcon" }),
        iconBase64: z.string({ error: "errors.addIcon" }).nonempty({ error: "errors.addIcon" }),
    });



export const NotificationTemplateSchema =
    z.object({
        name: z.string({ error: "errors.nameRequired" }).nonempty({ error: "errors.nameRequired" }),
        titleTemplate: z.string({ error: "errors.titleRequired" }).nonempty({ error: "errors.titleRequired" }).min(3, { error: "errors.min3Chars" }),
        bodyTemplate: z.string({ error: "errors.textRequired" }).nonempty({ error: "errors.textRequired" }).min(3, { error: "errors.min3Chars" }),
    });



