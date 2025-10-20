/**
 * Unit tests for CleanSlate GraphQL API Endpoints
 *
 * Tests all CRUD operations and summary endpoint functionality
 * with mocked GraphQL responses.
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
    baseUrl: 'https://cleanslate.jinocenc.io/auth/graphql',
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
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({
          data: {
            insert_quick_logs_one: {
              id: mockFoodEntry.id,
              name: mockFoodEntry.name,
              calories: mockFoodEntry.calories,
              protein: mockFoodEntry.protein,
              createdAt: mockFoodEntry.timestamp,
            },
          },
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
        'https://cleanslate.jinocenc.io/auth/graphql',
        expect.objectContaining({
          method: 'POST',
          body: expect.stringContaining('CREATE_QUICK_LOG'),
        })
      );
    });
  });

  describe('getTodayLog', () => {
    it('should retrieve array of food entries', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({
          data: {
            quick_logs: [
              {
                id: mockFoodEntry.id,
                name: mockFoodEntry.name,
                calories: mockFoodEntry.calories,
                protein: mockFoodEntry.protein,
                createdAt: mockFoodEntry.timestamp,
              },
            ],
          },
        }),
      });

      const result = await client.getTodayLog();

      expect(result).toEqual({ entries: [mockFoodEntry] });
      expect(global.fetch).toHaveBeenCalledWith(
        'https://cleanslate.jinocenc.io/auth/graphql',
        expect.objectContaining({
          method: 'POST',
          body: expect.stringContaining('GET_TODAY_LOGS'),
        })
      );
    });

    it('should handle empty log', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({
          data: {
            quick_logs: [],
          },
        }),
      });

      const result = await client.getTodayLog();

      expect(result).toEqual({ entries: [] });
    });

    it('should filter by today\'s timestamps', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({
          data: {
            quick_logs: [],
          },
        }),
      });

      await client.getTodayLog();

      const fetchCall = (global.fetch as any).mock.calls[0];
      const body = JSON.parse(fetchCall[1].body);

      // Verify date filtering variables are present
      expect(body.variables).toHaveProperty('today');
      expect(body.variables).toHaveProperty('tomorrow');

      // Verify they are valid ISO timestamps
      expect(body.variables.today).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
      expect(body.variables.tomorrow).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);

      // Verify tomorrow is after today
      const todayDate = new Date(body.variables.today);
      const tomorrowDate = new Date(body.variables.tomorrow);
      expect(tomorrowDate.getTime()).toBeGreaterThan(todayDate.getTime());
    });
  });

  describe('deleteFoodEntry', () => {
    it('should delete entry by ID', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({
          data: {
            delete_quick_logs_by_pk: {
              id: mockFoodEntry.id,
            },
          },
        }),
      });

      const entryId = '550e8400-e29b-41d4-a716-446655440000';
      const result = await client.deleteFoodEntry(entryId);

      expect(result).toEqual({ success: true });
      expect(global.fetch).toHaveBeenCalledWith(
        'https://cleanslate.jinocenc.io/auth/graphql',
        expect.objectContaining({
          method: 'POST',
          body: expect.stringContaining('DELETE_QUICK_LOG'),
        })
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
          data: {
            update_quick_logs_by_pk: {
              id: updatedEntry.id,
              name: updatedEntry.name,
              calories: updatedEntry.calories,
              protein: updatedEntry.protein,
              createdAt: updatedEntry.timestamp,
            },
          },
        }),
      });

      const entryId = '550e8400-e29b-41d4-a716-446655440000';
      const result = await client.updateFoodEntry(entryId, { calories: 180 });

      expect(result).toEqual({ entry: updatedEntry });
      expect(global.fetch).toHaveBeenCalledWith(
        'https://cleanslate.jinocenc.io/auth/graphql',
        expect.objectContaining({
          method: 'POST',
          body: expect.stringContaining('UPDATE_QUICK_LOG'),
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
          data: {
            update_quick_logs_by_pk: {
              id: updatedEntry.id,
              name: updatedEntry.name,
              calories: updatedEntry.calories,
              protein: updatedEntry.protein,
              createdAt: updatedEntry.timestamp,
            },
          },
        }),
      });

      const entryId = '550e8400-e29b-41d4-a716-446655440000';
      const result = await client.updateFoodEntry(entryId, {
        name: 'Grilled chicken',
      });

      expect(result.entry.name).toBe('Grilled chicken');
    });

    it('should send pk_columns and set variables correctly', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({
          data: {
            update_quick_logs_by_pk: {
              id: mockFoodEntry.id,
              name: mockFoodEntry.name,
              calories: 200,
              protein: mockFoodEntry.protein,
              createdAt: mockFoodEntry.timestamp,
            },
          },
        }),
      });

      await client.updateFoodEntry('test-id', { calories: 200 });

      const fetchCall = (global.fetch as any).mock.calls[0];
      const body = JSON.parse(fetchCall[1].body);

      expect(body.variables.pk_columns).toEqual({ id: 'test-id' });
      expect(body.variables.set).toEqual({ calories: 200 });
    });
  });

  describe('getTodaySummary', () => {
    it('should retrieve today\'s totals calculated client-side', async () => {
      const entry1 = {
        id: '1',
        name: 'Chicken',
        calories: 165,
        protein: 31,
        createdAt: '2025-10-20T14:30:00Z',
      };
      const entry2 = {
        id: '2',
        name: 'Rice',
        calories: 140,
        protein: 12,
        createdAt: '2025-10-20T15:30:00Z',
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({
          data: {
            quick_logs: [entry1, entry2],
          },
        }),
      });

      const result = await client.getTodaySummary();

      expect(result).toEqual({
        totalCalories: 305,
        totalProtein: 43,
        entryCount: 2,
      });
    });

    it('should handle empty log with zero totals', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({
          data: {
            quick_logs: [],
          },
        }),
      });

      const result = await client.getTodaySummary();

      expect(result).toEqual({
        totalCalories: 0,
        totalProtein: 0,
        entryCount: 0,
      });
    });
  });
});
