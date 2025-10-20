/**
 * Unit tests for CleanSlate API Endpoints
 *
 * Tests all CRUD operations and summary endpoint functionality
 * with mocked API responses.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CleanSlateApiClient } from '../../../src/api/endpoints.js';
import type { FoodEntry } from '../../../src/types/food-entry.js';

// Mock fetch globally
global.fetch = vi.fn();

describe('CleanSlateApiClient', () => {
  let client: CleanSlateApiClient;
  const mockConfig = {
    apiKey: 'test-key',
    baseUrl: 'https://api.test.com/v1',
    timeout: 5000,
    maxRetries: 1,
  };

  const mockFoodEntry: FoodEntry = {
    id: '550e8400-e29b-41d4-a716-446655440000',
    name: 'Chicken breast',
    calories: 165,
    protein: 31,
    timestamp: '2025-10-20T14:30:00Z',
  };

  beforeEach(() => {
    client = new CleanSlateApiClient(mockConfig);
    vi.clearAllMocks();
  });

  describe('createFoodEntry', () => {
    it('should create food entry and return entry data', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        status: 201,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({
          entry: mockFoodEntry,
        }),
      });

      const result = await client.createFoodEntry({
        name: 'Chicken breast',
        calories: 165,
        protein: 31,
      });

      expect(result).toEqual({
        entry: mockFoodEntry,
      });
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.test.com/v1/food-entries',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            name: 'Chicken breast',
            calories: 165,
            protein: 31,
          }),
        })
      );
    });
  });

  describe('getTodayLog', () => {
    it('should retrieve array of food entries', async () => {
      const entries = [mockFoodEntry];
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({
          entries,
        }),
      });

      const result = await client.getTodayLog();

      expect(result).toEqual({ entries });
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.test.com/v1/food-entries/today',
        expect.objectContaining({ method: 'GET' })
      );
    });

    it('should handle empty log', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({
          entries: [],
        }),
      });

      const result = await client.getTodayLog();

      expect(result).toEqual({ entries: [] });
    });
  });

  describe('deleteFoodEntry', () => {
    it('should delete entry by ID', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({
          success: true,
        }),
      });

      const entryId = '550e8400-e29b-41d4-a716-446655440000';
      const result = await client.deleteFoodEntry(entryId);

      expect(result).toEqual({ success: true });
      expect(global.fetch).toHaveBeenCalledWith(
        `https://api.test.com/v1/food-entries/${entryId}`,
        expect.objectContaining({ method: 'DELETE' })
      );
    });
  });

  describe('updateFoodEntry', () => {
    it('should update entry with partial data', async () => {
      const updatedEntry = { ...mockFoodEntry, calories: 180 };
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({
          entry: updatedEntry,
        }),
      });

      const entryId = '550e8400-e29b-41d4-a716-446655440000';
      const result = await client.updateFoodEntry(entryId, { calories: 180 });

      expect(result).toEqual({ entry: updatedEntry });
      expect(global.fetch).toHaveBeenCalledWith(
        `https://api.test.com/v1/food-entries/${entryId}`,
        expect.objectContaining({
          method: 'PATCH',
          body: JSON.stringify({ calories: 180 }),
        })
      );
    });

    it('should allow updating name only', async () => {
      const updatedEntry = { ...mockFoodEntry, name: 'Grilled chicken' };
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({
          entry: updatedEntry,
        }),
      });

      const entryId = '550e8400-e29b-41d4-a716-446655440000';
      const result = await client.updateFoodEntry(entryId, {
        name: 'Grilled chicken',
      });

      expect(result.entry.name).toBe('Grilled chicken');
    });
  });

  describe('getTodaySummary', () => {
    it('should retrieve today\'s totals', async () => {
      const summary = {
        totalCalories: 305,
        totalProtein: 43,
        entryCount: 2,
      };
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => summary,
      });

      const result = await client.getTodaySummary();

      expect(result).toEqual(summary);
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.test.com/v1/food-entries/today/summary',
        expect.objectContaining({ method: 'GET' })
      );
    });

    it('should handle empty log with zero totals', async () => {
      const summary = {
        totalCalories: 0,
        totalProtein: 0,
        entryCount: 0,
      };
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => summary,
      });

      const result = await client.getTodaySummary();

      expect(result).toEqual(summary);
    });
  });
});
