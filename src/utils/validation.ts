import { z } from "zod";

/**
 * Validation schema for logging food entries
 * Ensures judgment-free error messages
 */
export const LogFoodSchema = z.object({
  name: z
    .string()
    .min(1, "Food name is required")
    .max(200, "Food name must be 200 characters or less"),
  calories: z
    .number()
    .int("Calories must be a whole number")
    .min(0, "Calories must be at least 0")
    .max(10000, "Calories must be 10,000 or less"),
  protein: z
    .number()
    .min(0, "Protein must be at least 0 grams")
    .max(500, "Protein must be 500 grams or less"),
});

/**
 * Validation schema for deleting food entries
 * Ensures valid UUID format
 */
export const DeleteFoodEntrySchema = z.object({
  entryId: z.string().uuid("Entry ID must be a valid identifier"),
});

/**
 * Validation schema for editing food entries
 * Requires at least one field to be updated
 */
export const EditFoodEntrySchema = z
  .object({
    entryId: z.string().uuid("Entry ID must be a valid identifier"),
    name: z.string().min(1).max(200).optional(),
    calories: z.number().int().min(0).max(10000).optional(),
    protein: z.number().min(0).max(500).optional(),
  })
  .refine(
    (data) =>
      data.name !== undefined ||
      data.calories !== undefined ||
      data.protein !== undefined,
    {
      message:
        "Provide at least one field to update (calories, protein, or name)",
    }
  );

/**
 * Schema for tools that take no input
 */
export const GetTodayLogSchema = z.object({});
export const GetTodaySummarySchema = z.object({});
