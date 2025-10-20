import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { loadEnvironment } from "../../../src/config/environment.js";

describe("Environment Configuration", () => {
  let originalEnv: NodeJS.ProcessEnv;

  beforeEach(() => {
    // Save original environment
    originalEnv = { ...process.env };
  });

  afterEach(() => {
    // Restore original environment
    process.env = originalEnv;
    vi.restoreAllMocks();
  });

  it("should load valid environment configuration with all values", () => {
    process.env.CLEANSLATE_API_KEY = "test-api-key-12345";
    process.env.CLEANSLATE_API_BASE_URL = "https://api.cleanslate.sh/v1";
    process.env.LOG_LEVEL = "debug";
    process.env.REQUEST_TIMEOUT_MS = "5000";
    process.env.MAX_RETRIES = "2";

    const config = loadEnvironment();

    expect(config.CLEANSLATE_API_KEY).toBe("test-api-key-12345");
    expect(config.CLEANSLATE_API_BASE_URL).toBe(
      "https://api.cleanslate.sh/v1"
    );
    expect(config.LOG_LEVEL).toBe("debug");
    expect(config.REQUEST_TIMEOUT_MS).toBe(5000);
    expect(config.MAX_RETRIES).toBe(2);
  });

  it("should apply default values for optional configuration", () => {
    process.env.CLEANSLATE_API_KEY = "test-api-key";

    const config = loadEnvironment();

    expect(config.CLEANSLATE_API_BASE_URL).toBe(
      "https://api.cleanslate.sh/v1"
    );
    expect(config.LOG_LEVEL).toBe("info");
    expect(config.REQUEST_TIMEOUT_MS).toBe(10000);
    expect(config.MAX_RETRIES).toBe(1);
  });

  it("should exit process when CLEANSLATE_API_KEY is missing", () => {
    delete process.env.CLEANSLATE_API_KEY;

    const mockExit = vi.spyOn(process, "exit").mockImplementation((code) => {
      throw new Error(`process.exit: ${code}`);
    });

    const mockConsoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    expect(() => loadEnvironment()).toThrow("process.exit: 1");
    expect(mockExit).toHaveBeenCalledWith(1);
    expect(mockConsoleError).toHaveBeenCalledWith("Configuration error:");

    mockExit.mockRestore();
    mockConsoleError.mockRestore();
  });
});
