import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { CleanSlateApiClient } from "./api/endpoints.js";
import { loadEnvironment } from "./config/environment.js";
import { logFood } from "./tools/log-food.js";
import { getTodayLog } from "./tools/get-today-log.js";
import { deleteFoodEntry } from "./tools/delete-food-entry.js";
import { editFoodEntry } from "./tools/edit-food-entry.js";
import { getTodaySummary } from "./tools/get-today-summary.js";

/**
 * MCP Server for CleanSlate API
 * Exposes food logging tools through the Model Context Protocol
 */
export class CleanSlateServer {
  private server: Server;
  private _apiClient: CleanSlateApiClient;

  constructor() {
    // Load and validate environment configuration
    const config = loadEnvironment();

    // Initialize CleanSlate API client
    this._apiClient = new CleanSlateApiClient({
      apiKey: config.CLEANSLATE_API_KEY,
      baseUrl: config.CLEANSLATE_API_BASE_URL,
      timeout: config.REQUEST_TIMEOUT_MS,
      maxRetries: config.MAX_RETRIES,
    });

    // Initialize MCP server
    this.server = new Server(
      {
        name: "cleanslate-mcp",
        version: "0.1.0",
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupHandlers();
  }

  /**
   * Get API client instance (for tool implementations)
   */
  get apiClient(): CleanSlateApiClient {
    return this._apiClient;
  }

  /**
   * Set up MCP protocol handlers
   */
  private setupHandlers(): void {
    // Handle tool listing requests
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: "log_food",
          description:
            "Add a food entry to today's log with calories and protein",
          inputSchema: {
            type: "object",
            properties: {
              name: {
                type: "string",
                description: "Food name or description (1-200 characters)",
              },
              calories: {
                type: "number",
                description: "Calories (0-10000, whole number)",
              },
              protein: {
                type: "number",
                description: "Protein in grams (0-500, can be decimal)",
              },
            },
            required: ["name", "calories", "protein"],
          },
        },
        {
          name: "get_today_log",
          description: "Retrieve all food entries logged today",
          inputSchema: {
            type: "object",
            properties: {},
          },
        },
        {
          name: "delete_food_entry",
          description: "Remove a food entry from today's log",
          inputSchema: {
            type: "object",
            properties: {
              entryId: {
                type: "string",
                description: "UUID of the entry to delete",
              },
            },
            required: ["entryId"],
          },
        },
        {
          name: "edit_food_entry",
          description: "Update calories, protein, or name of an existing entry",
          inputSchema: {
            type: "object",
            properties: {
              entryId: {
                type: "string",
                description: "UUID of the entry to edit",
              },
              name: {
                type: "string",
                description: "Updated food name (optional, 1-200 characters)",
              },
              calories: {
                type: "number",
                description: "Updated calories (optional, 0-10000)",
              },
              protein: {
                type: "number",
                description: "Updated protein in grams (optional, 0-500)",
              },
            },
            required: ["entryId"],
          },
        },
        {
          name: "get_today_summary",
          description: "Get total calories and protein for today",
          inputSchema: {
            type: "object",
            properties: {},
          },
        },
      ],
    }));

    // Handle tool execution requests
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        let result;

        switch (name) {
          case "log_food":
            result = await logFood(this._apiClient, args);
            break;

          case "get_today_log":
            result = await getTodayLog(this._apiClient, args);
            break;

          case "delete_food_entry":
            result = await deleteFoodEntry(this._apiClient, args);
            break;

          case "edit_food_entry":
            result = await editFoodEntry(this._apiClient, args);
            break;

          case "get_today_summary":
            result = await getTodaySummary(this._apiClient, args);
            break;

          default:
            throw new Error(`Unknown tool: ${name}`);
        }

        // Return successful result as JSON text
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      } catch (error) {
        // Return error with judgment-free message
        const errorMessage =
          error instanceof Error ? error.message : "An error occurred";
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  success: false,
                  error: errorMessage,
                },
                null,
                2
              ),
            },
          ],
          isError: true,
        };
      }
    });
  }

  /**
   * Start the MCP server with stdio transport
   */
  async start(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error("CleanSlate MCP server started on stdio");
  }

  /**
   * Gracefully shut down the server
   */
  async stop(): Promise<void> {
    await this.server.close();
    console.error("CleanSlate MCP server stopped");
  }
}
