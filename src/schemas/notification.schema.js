import z from "zod";

export const NotificationImageSchema = z.object({
    fileName: z
        .string({ message: "errors.required" })
        .min(1, { message: "errors.required" }),
    base64: z
        .string({ message: "errors.required" })
        .min(1, { message: "errors.required" }),
    notificationId: z.number({ message: "errors.required" }),
});

export const NotificationSchema =
    z.object({
        notificationTypeId: z.number({ error: "errors.notificationTypeRequired" }).nonnegative({ error: "errors.notificationTypeRequired" }),
        notificationTemplateId: z.number({ error: "errors.notificationTemplateRequired" }).nonnegative({ error: "errors.notificationTemplateRequired" }),
        sendDate: z.iso.datetime({ message: "errors.invalidDate" }).nonempty({ error: "errors.sendDateRequired" }),
        images: z.array(NotificationImageSchema).nonempty({ message: "errors.required" }),
    });



export const NotificationTypeSchema =
    z.object({
        name: z.string({ error: "errors.nameRequired" }).nonempty({ error: "errors.nameRequired" }),
        soundFileName: z.string({ error: "errors.addSoundName" }).nonempty({ error: "errors.addSoundName" }),
        iconFileName: z.string({ error: "errors.addIcon" }).nonempty({ error: "errors.addIcon" }),
        iconBase64: z.string({ error: "errors.addIcon" }).nonempty({ error: "errors.addIcon" }),
    });


export const NotificationTypeUpdateSchema =
    z.object({
        id: z.number({ error: "errors.required" }).nonnegative({ error: "errors.required" }),
        name: z.string({ error: "errors.nameRequired" }).optional(),
        soundFileName: z.string({ error: "errors.addSoundName" }).optional(),
        iconFileName: z.string({ error: "errors.addIcon" }).optional(),
        iconBase64: z.string({ error: "errors.addIcon" }).optional(),
    });


export const NotificationTemplateSchema =
    z.object({
        titleTemplate: z.string({ error: "errors.titleRequired" }).nonempty({ error: "errors.titleRequired" }).min(3, { error: "errors.min3Chars" }),
        bodyTemplate: z.string({ error: "errors.textRequired" }).nonempty({ error: "errors.textRequired" }).min(3, { error: "errors.min3Chars" }),
    });



