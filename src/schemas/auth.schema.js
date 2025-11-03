import { z } from "zod";
import { PasswordSchemaControl, phoneRegex } from "./shared.schema";


export const LoginSchema = z.object({
    userName: z
        .string({ error: "errors.required" })
        .nonempty("errors.required")
        .refine((val) => {
            return true
            // const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
            // const isPhone = phoneRegex.test(val);
            // return isEmail || isPhone;
        }, { error: "errors.emailUserName" }),
    password: PasswordSchemaControl
});





