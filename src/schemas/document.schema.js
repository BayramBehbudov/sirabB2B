import z from "zod";
import { RequiredSchemaMin3 } from "./shared.schema";

export const DocumentTypeSchema = z.object({
    name: RequiredSchemaMin3,
    isOptional: z.boolean().default(false),
})