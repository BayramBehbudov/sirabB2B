import z from "zod";
import { RequiredSchemaId } from "./shared.schema";


export const PaymentTypeSchema = z.object({
    id: RequiredSchemaId,
    name: z.string({ error: "errors.nameRequired" }).nonempty({ error: "errors.nameRequired" }),
    description: z.string({ error: "errors.descriptionRequired" }).optional(),
    fileName: z
        .string({ message: "errors.required" })
        .min(1, { message: "errors.required" }),
    base64: z.string({ message: "errors.required" }).optional(),
}).superRefine((data, ctx) => {
     if (data.id === 0 && !data.base64) {
        ctx.addIssue({
            code: 'custom',
            message: "errors.required",
            path: ["base64"],
        });
    }
});
