import { z } from "zod";

export const profileUpdateSchema = z.object({
  name: z.string().trim().max(100).optional(),
  college: z.string().trim().max(150).optional(),
  branch: z.string().trim().max(100).optional(),
  currentSemester: z
    .union([z.string().trim(), z.number().int().min(1).max(8)])
    .optional(),
  careerGoal: z.string().trim().max(100).optional(),
  github: z.string().trim().url().or(z.literal("")).optional(),
  linkedin: z.string().trim().url().or(z.literal("")).optional(),
});
