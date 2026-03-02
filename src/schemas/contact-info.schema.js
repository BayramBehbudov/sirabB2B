import z from "zod";
import { PhoneSchemaOptional, } from "./shared.schema";

export const ContactInfoSchema = z.object({
    whatsAppNumber: PhoneSchemaOptional,
    callNumber: PhoneSchemaOptional,
})