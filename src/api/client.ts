import {
  ApiError,
  AuthenticationError,
  CleanSlateError,
  NetworkError,
} from "../utils/errors.js";

export interface ClientConfig {
  apiKey: string;
  baseUrl: string;
  timeout: number;
  maxRetries: number;
}

interface ErrorResponse {
  message?: string;
}

/**
 * GraphQL client for CleanSlate API
 * Handles authentication, retries, and error mapping for GraphQL operations
 */
export class CleanSlateClient {
  private readonly config: ClientConfig;

  constructor(config: ClientConfig) {
    this.config = config;
  }

  /**
   * Execute GraphQL query or mutation with authentication and error handling
   */
  protected async executeGraphQL<T>(
    query: string,
    variables?: Record<string, unknown>
  ): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

    try {
      const response = await this.fetchWithRetry(this.config.baseUrl, {
        method: "POST",
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: this.config.apiKey,
          query,
          variables,
        }),
      });

      clearTimeout(timeoutId);
      return await this.handleGraphQLResponse<T>(response);
    } catch (error) {
      clearTimeout(timeoutId);
      throw this.handleError(error);
    }
  }

  /**
   * Fetch with automatic retry logic
   */
  private async fetchWithRetry(
    url: string,
    options: RequestInit,
    attempt = 0
  ): Promise<Response> {
    try {
      return await fetch(url, options);
    } catch (error) {
      if (attempt < this.config.maxRetries) {
        // Wait 1 second before retrying
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return this.fetchWithRetry(url, options, attempt + 1);
      }
      throw error;
    }
  }

  /**
   * Handle GraphQL response and parse JSON
   * Note: CleanSlate's /auth/graphql endpoint returns data directly, not wrapped in { data: {...} }
   */
  private async handleGraphQLResponse<T>(response: Response): Promise<T> {
    const contentType = response.headers.get("content-type");
    const isJson = contentType?.includes("application/json");

    if (!response.ok) {
      // Handle HTTP-level errors
      let errorMessage: string;

      try {
        if (isJson) {
          const errorBody = (await response.json()) as ErrorResponse;
          errorMessage = errorBody.message || "Unknown error occurred";
        } else {
          errorMessage = await response.text();
        }
      } catch {
        errorMessage = "Unknown error occurred";
      }

      if (response.status === 401 || response.status === 403) {
        throw new AuthenticationError(
          "Invalid API key. Check your CLEANSLATE_API_KEY configuration."
        );
      }

      throw new ApiError(
        errorMessage || "Couldn't complete request right now. Try again in a moment."
      );
    }

    if (!isJson) {
      throw new ApiError("Expected JSON response from GraphQL endpoint");
    }

    // The /auth/graphql endpoint returns data directly without GraphQL wrapper
    const data = (await response.json()) as T;

    if (!data) {
      throw new ApiError("No data returned from GraphQL query");
    }

    return data;
  }

  /**
   * Map network errors to user-friendly messages
   */
  private handleError(error: unknown): Error {
    if (error instanceof CleanSlateError) {
      return error;
    }

    if (error instanceof Error) {
      if (error.name === "AbortError") {
        return new NetworkError(
          "Request timed out. Check your connection and try again."
        );
      }
      if (
        error.message.includes("fetch") ||
        error.message.includes("network")
      ) {
        return new NetworkError();
      }
    }

    return new ApiError();
  }
}
