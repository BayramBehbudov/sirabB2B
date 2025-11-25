import z from "zod";
import { RequiredSchemaId, RequiredSchemaIntNumber, RequiredSchemaMin1, RequiredSchemaMin2, RequiredSchemaMin3, RequiredSchemaNumber } from "./shared.schema";

export const ProductCategorySchema = z.object({
    name: z.string({ error: "errors.nameRequired" }).nonempty({ error: "errors.nameRequired" }),
    fileName: z
        .string({ message: "errors.required" })
        .min(1, { message: "errors.required" }),
    base64: z
        .string({ message: "errors.required" })
        .min(1, { message: "errors.required" }),
});


export const UnitSchema = z.object({
    name: RequiredSchemaMin2,
    code: RequiredSchemaMin2,
});
export const ProductUnitSchema = z.object({
    unitDefinitionId: RequiredSchemaNumber,
    unit: RequiredSchemaNumber,
    id: RequiredSchemaId,
});

export const ProductPriceSchema = z.object({
    price: RequiredSchemaNumber,
    startDate: RequiredSchemaMin1,
    endDate: RequiredSchemaMin1,
    priority: RequiredSchemaIntNumber,
    isVAT: z.boolean(),
    id: RequiredSchemaId,
});
export const ProductImageSchema = z.object({
    fileName: z
        .string({ message: "errors.required" })
        .min(1, { message: "errors.required" }),
    base64: z
        .string({ message: "errors.required" })
        .min(1, { message: "errors.required" }),
    id: RequiredSchemaId,
});


export const ProductSchema = z.object({
    erpId: RequiredSchemaMin3,
    name: RequiredSchemaMin3,
    description: RequiredSchemaMin3,
    productCategoryId: RequiredSchemaNumber,
    productPrices: z.array(ProductPriceSchema).min(1, { message: "errors.priceRequired" }).superRefine((prices, ctx) => {
        const priorities = prices.map(p => p.priority);
        const duplicates = priorities.filter((p, idx) => priorities.indexOf(p) !== idx);
        if (duplicates.length > 0) {
            ctx.addIssue({
                code: "custom",
                message: "errors.duplicatePriority",
                path: ["productPrices"],
            });
        }
    }),
    productUnits: z.array(ProductUnitSchema).min(1, { message: "errors.unitRequired" }).superRefine((units, ctx) => {
        const ids = units.map(u => u.unitDefinitionId);

        const duplicates = ids.filter((id, idx) => ids.indexOf(id) !== idx);

        if (duplicates.length > 0) {
            ctx.addIssue({
                code: "custom",
                message: "errors.duplicateUnit",
                path: ["productUnits"],
            });
        }
    }),
    productImages: z
        .array(ProductImageSchema)
        .nonempty({ message: "errors.required" }),
});
