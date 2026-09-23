import { z } from "zod";

export const resourceCreateSchema = z.object({
  unitId: z.string().min(1, "Unit is required"),

  type: z.enum(["HANDWRITTEN", "PDF", "EXTERNAL", "YOUTUBE"]),

  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(150, "Title must be 150 characters or less"),

  description: z
    .string()
    .trim()
    .max(500, "Description must be 500 characters or less")
    .optional()
    .or(z.literal("")),

  url: z.string().trim().url("Please enter a valid URL").or(z.literal(""))
});
