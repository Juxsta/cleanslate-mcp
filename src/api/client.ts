import {
  ApiError,
  AuthenticationError,
  CleanSlateError,
  NetworkError,
  NotFoundError,
  ValidationError,
} from "../utils/errors.js";
import { HTTP_STATUS } from "../constants.js";

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
 * HTTP client for CleanSlate API
 * Handles authentication, retries, and error mapping
 */
export class CleanSlateClient {
  private readonly config: ClientConfig;

  constructor(config: ClientConfig) {
    this.config = config;
  }

  /**
   * Execute HTTP request with authentication and error handling
   */
  protected async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.config.baseUrl}${endpoint}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

    try {
      const response = await this.fetchWithRetry(url, {
        ...options,
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.config.apiKey}`,
          ...options.headers,
        },
      });

      clearTimeout(timeoutId);
      return await this.handleResponse<T>(response);
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
   * Handle HTTP response and parse JSON
   */
  private async handleResponse<T>(response: Response): Promise<T> {
    const contentType = response.headers.get("content-type");
    const isJson = contentType?.includes("application/json");

    if (!response.ok) {
      let errorBody: ErrorResponse;

      try {
        errorBody = isJson
          ? ((await response.json()) as ErrorResponse)
          : { message: await response.text() };
      } catch {
        errorBody = { message: "Unknown error occurred" };
      }

      switch (response.status) {
        case HTTP_STATUS.BAD_REQUEST:
          throw new ValidationError(
            errorBody.message || "Invalid request data"
          );
        case HTTP_STATUS.UNAUTHORIZED:
        case HTTP_STATUS.FORBIDDEN:
          throw new AuthenticationError(
            errorBody.message ||
              "Invalid API key. Check your CLEANSLATE_API_KEY configuration."
          );
        case HTTP_STATUS.NOT_FOUND:
          throw new NotFoundError(
            errorBody.message ||
              "That entry wasn't found. It may have been deleted."
          );
        default:
          throw new ApiError(
            errorBody.message ||
              "Couldn't complete request right now. Try again in a moment."
          );
      }
    }

    if (isJson) {
      return (await response.json()) as T;
    }

    return {} as T;
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

  /**
   * HTTP GET request
   */
  protected async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "GET" });
  }

  /**
   * HTTP POST request
   */
  protected async post<T>(endpoint: string, body: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(body),
    });
  }

  /**
   * HTTP PATCH request
   */
  protected async patch<T>(endpoint: string, body: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PATCH",
      body: JSON.stringify(body),
    });
  }

  /**
   * HTTP DELETE request
   */
  protected async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "DELETE" });
  }
}
