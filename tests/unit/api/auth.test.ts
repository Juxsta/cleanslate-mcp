import { describe, it, expect } from "vitest";
import {
  createAuthHeaders,
  validateApiKey,
} from "../../../src/api/auth.js";
import { AuthenticationError } from "../../../src/utils/errors.js";

describe("Authentication", () => {
  describe("createAuthHeaders", () => {
    it("should create Authorization header with Bearer token", () => {
      const headers = createAuthHeaders({ apiKey: "test-api-key-123" });

      expect(headers.Authorization).toBe("Bearer test-api-key-123");
    });

    it("should throw AuthenticationError if API key is missing", () => {
      expect(() => createAuthHeaders({ apiKey: "" })).toThrow(
        AuthenticationError
      );
    });
  });

  describe("validateApiKey", () => {
    it("should return true for valid API key", () => {
      expect(validateApiKey("valid-api-key")).toBe(true);
    });

    it("should throw AuthenticationError for empty API key", () => {
      expect(() => validateApiKey("")).toThrow(AuthenticationError);
    });
  });
});
