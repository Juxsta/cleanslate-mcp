import { describe, it, expect } from "vitest";
import { getTodayISO, getCurrentTimestamp, isToday } from "../../../src/utils/date.js";

describe("Date Utilities", () => {
  describe("getTodayISO", () => {
    it("should return date in ISO format (YYYY-MM-DD)", () => {
      const date = getTodayISO();
      expect(date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    it("should return the same date when called multiple times in quick succession", () => {
      const date1 = getTodayISO();
      const date2 = getTodayISO();
      expect(date1).toBe(date2);
    });
  });

  describe("getCurrentTimestamp", () => {
    it("should return timestamp in ISO 8601 format", () => {
      const timestamp = getCurrentTimestamp();
      expect(timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
    });

    it("should include timezone information", () => {
      const timestamp = getCurrentTimestamp();
      expect(timestamp).toContain("Z");
    });
  });

  describe("isToday", () => {
    it("should return true for current date", () => {
      const today = new Date().toISOString();
      expect(isToday(today)).toBe(true);
    });

    it("should return false for yesterday", () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      expect(isToday(yesterday.toISOString())).toBe(false);
    });

    it("should return false for tomorrow", () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      expect(isToday(tomorrow.toISOString())).toBe(false);
    });
  });
});
