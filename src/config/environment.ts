import { z } from "zod";

/**
 * Environment variable schema with validation
 */
const EnvironmentSchema = z.object({
  CLEANSLATE_API_KEY: z
    .string()
    .min(1, "CLEANSLATE_API_KEY is required for authentication"),
  CLEANSLATE_API_BASE_URL: z
    .string()
    .url("CLEANSLATE_API_BASE_URL must be a valid URL")
    .default("https://api.cleanslate.sh/v1"),
  LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]).default("info"),
  REQUEST_TIMEOUT_MS: z.coerce
    .number()
    .positive("REQUEST_TIMEOUT_MS must be positive")
    .default(10000),
  MAX_RETRIES: z.coerce
    .number()
    .int("MAX_RETRIES must be an integer")
    .min(0, "MAX_RETRIES must be at least 0")
    .max(3, "MAX_RETRIES must be 3 or less")
    .default(1),
});

export type Environment = z.infer<typeof EnvironmentSchema>;

/**
 * Load and validate environment variables
 * Exits process with error if validation fails
 */
export function loadEnvironment(): Environment {
  const result = EnvironmentSchema.safeParse(process.env);

  if (!result.success) {
    console.error("Configuration error:");
    console.error(result.error.format());
    process.exit(1);
  }

  return result.data;
}
