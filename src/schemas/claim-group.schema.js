import z from "zod";
import { RequiredSchemaMin2 } from "./shared.schema";

export const ClaimGroupSchema = z.object({
    name: RequiredSchemaMin2,
})