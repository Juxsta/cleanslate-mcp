/**
 * Unit tests for CleanSlate GraphQL Client
 *
 * Tests the core GraphQL client functionality including authentication,
 * error handling, retry logic, and request/response processing.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { CleanSlateClient } from '../../../src/api/client.js';
import {
  AuthenticationError,
  ValidationError,
  NotFoundError,
  ApiError,
} from '../../../src/utils/errors.js';

// Mock fetch globally
global.fetch = vi.fn();

describe('CleanSlateClient', () => {
  let client: CleanSlateClient;
  const mockConfig = {
    apiKey: 'test-api-key-123',
    baseUrl: 'https://cleanslate.jinocenc.io/auth/graphql',
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
        json: async () => ({ data: { test: 'value' } }),
      });

      await client['executeGraphQL']('query { test }');

      expect(global.fetch).toHaveBeenCalledWith(
        'https://cleanslate.jinocenc.io/auth/graphql',
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer test-api-key-123',
          }),
        })
      );
    });

    it('should send GraphQL query in POST body', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ data: { test: 'value' } }),
      });

      const query = 'query { test }';
      const variables = { id: '123' };
      await client['executeGraphQL'](query, variables);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ query, variables }),
        })
      );
    });
  });

  describe('GraphQL Error Handling', () => {
    it('should throw AuthenticationError for GraphQL auth errors', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({
          errors: [{ message: 'Unauthorized access' }],
        }),
      });

      await expect(client['executeGraphQL']('query { test }')).rejects.toThrow(
        AuthenticationError
      );
    });

    it('should throw ValidationError for GraphQL validation errors', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({
          errors: [{ message: 'Invalid input data' }],
        }),
      });

      await expect(client['executeGraphQL']('query { test }')).rejects.toThrow(
        ValidationError
      );
    });

    it('should throw NotFoundError for GraphQL not found errors', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({
          errors: [{ message: 'Entry not found' }],
        }),
      });

      await expect(client['executeGraphQL']('query { test }')).rejects.toThrow(
        NotFoundError
      );
    });

    it('should throw ApiError for generic GraphQL errors', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({
          errors: [{ message: 'Something went wrong' }],
        }),
      });

      await expect(client['executeGraphQL']('query { test }')).rejects.toThrow(
        ApiError
      );
    });

    it('should throw ApiError when no data is returned', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({}),
      });

      await expect(client['executeGraphQL']('query { test }')).rejects.toThrow(
        ApiError
      );
    });
  });

  describe('HTTP Error Handling', () => {
    it('should throw AuthenticationError for 401 response', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 401,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({
          message: 'Invalid API key',
        }),
      });

      await expect(client['executeGraphQL']('query { test }')).rejects.toThrow(
        AuthenticationError
      );
    });

    it('should throw AuthenticationError for 403 response', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 403,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({
          message: 'Forbidden',
        }),
      });

      await expect(client['executeGraphQL']('query { test }')).rejects.toThrow(
        AuthenticationError
      );
    });

    it('should throw ApiError for 500 response', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 500,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({
          message: 'Internal server error',
        }),
      });

      await expect(client['executeGraphQL']('query { test }')).rejects.toThrow(
        ApiError
      );
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
          json: async () => ({ data: { success: true } }),
        });

      const result = await client['executeGraphQL']('query { test }');

      expect(global.fetch).toHaveBeenCalledTimes(2);
      expect(result).toEqual({ success: true });
    });

    it('should throw error after max retries exceeded', async () => {
      // Fail both attempts
      (global.fetch as any).mockRejectedValue(new Error('Network error'));

      await expect(client['executeGraphQL']('query { test }')).rejects.toThrow();

      // Should be called twice (initial + 1 retry)
      expect(global.fetch).toHaveBeenCalledTimes(2);
    });
  });

  describe('Successful Responses', () => {
    it('should return data from successful GraphQL response', async () => {
      const mockData = { test: 'value', id: '123' };
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ data: mockData }),
      });

      const result = await client['executeGraphQL']('query { test }');

      expect(result).toEqual(mockData);
    });

    it('should handle GraphQL response with variables', async () => {
      const mockData = { user: { name: 'Test' } };
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ data: mockData }),
      });

      const result = await client['executeGraphQL'](
        'query GetUser($id: ID!) { user(id: $id) { name } }',
        { id: '123' }
      );

      expect(result).toEqual(mockData);
    });
  });
});
