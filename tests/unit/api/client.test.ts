/**
 * Unit tests for CleanSlate API Client
 *
 * Tests the core HTTP client functionality including authentication,
 * error handling, retry logic, and request/response processing.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { CleanSlateClient } from '../../../src/api/client.js';
import {
  AuthenticationError,
  ValidationError,
  NotFoundError,
  ApiError,
  CleanSlateError,
} from '../../../src/utils/errors.js';

// Mock fetch globally
global.fetch = vi.fn();

describe('CleanSlateClient', () => {
  let client: CleanSlateClient;
  const mockConfig = {
    apiKey: 'test-api-key-123',
    baseUrl: 'https://api.test.com/v1',
    timeout: 5000,
    maxRetries: 1,
  };

  beforeEach(() => {
    client = new CleanSlateClient(mockConfig);
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Authentication', () => {
    it('should include Authorization Bearer token in request headers', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ data: 'test' }),
      });

      await client['request']('/test', { method: 'GET' });

      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.test.com/v1/test',
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer test-api-key-123',
          }),
        })
      );
    });
  });

  describe('Error Mapping', () => {
    it('should throw error for 401 response', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 401,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({
          message: 'Invalid API key',
        }),
      });

      await expect(client['request']('/test', { method: 'GET' })).rejects.toThrow();
    });

    it('should throw error for 400 response', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 400,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({
          message: 'Invalid input',
        }),
      });

      await expect(client['request']('/test', { method: 'POST' })).rejects.toThrow();
    });

    it('should throw error for 404 response', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 404,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({
          message: 'Entry not found',
        }),
      });

      await expect(client['request']('/test', { method: 'GET' })).rejects.toThrow();
    });

    it('should throw error for 500 response', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 500,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({
          message: 'Internal server error',
        }),
      });

      await expect(client['request']('/test', { method: 'GET' })).rejects.toThrow();
    });
  });

  describe('Retry Logic', () => {
    it('should retry on network failure and succeed on second attempt', async () => {
      // First call fails, second succeeds
      (global.fetch as any)
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          headers: new Headers({ 'content-type': 'application/json' }),
          json: async () => ({ success: true }),
        });

      const result = await client['request']('/test', { method: 'GET' });

      expect(global.fetch).toHaveBeenCalledTimes(2);
      expect(result).toEqual({ success: true });
    });

    it('should throw error after max retries exceeded', async () => {
      // Fail both attempts
      (global.fetch as any).mockRejectedValue(new Error('Network error'));

      await expect(client['request']('/test', { method: 'GET' })).rejects.toThrow();

      // Should be called twice (initial + 1 retry)
      expect(global.fetch).toHaveBeenCalledTimes(2);
    });
  });

  describe('HTTP Methods', () => {
    it('should make GET request successfully', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ data: 'test' }),
      });

      const result = await client['get']('/test');

      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ method: 'GET' })
      );
      expect(result).toEqual({ data: 'test' });
    });

    it('should make POST request with body', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        status: 201,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ id: '123' }),
      });

      const body = { name: 'test', calories: 100 };
      const result = await client['post']('/test', body);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(body),
        })
      );
      expect(result).toEqual({ id: '123' });
    });

    it('should make PATCH request with body', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ updated: true }),
      });

      const updates = { calories: 150 };
      const result = await client['patch']('/test', updates);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          method: 'PATCH',
          body: JSON.stringify(updates),
        })
      );
      expect(result).toEqual({ updated: true });
    });

    it('should make DELETE request', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ success: true }),
      });

      const result = await client['delete']('/test');

      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ method: 'DELETE' })
      );
      expect(result).toEqual({ success: true });
    });
  });
});
