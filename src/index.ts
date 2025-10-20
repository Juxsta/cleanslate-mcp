#!/usr/bin/env node

import { config } from "dotenv";
import { CleanSlateServer } from "./server.js";

// Load environment variables from .env file
config();

/**
 * Main entry point for CleanSlate MCP Server
 */
async function main() {
  try {
    const server = new CleanSlateServer();

    // Handle graceful shutdown
    const shutdown = async () => {
      console.error("\nShutting down CleanSlate MCP server...");
      await server.stop();
      process.exit(0);
    };

    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);

    // Handle uncaught errors
    process.on("uncaughtException", (error) => {
      console.error("Uncaught exception:", error);
      process.exit(1);
    });

    process.on("unhandledRejection", (reason) => {
      console.error("Unhandled rejection:", reason);
      process.exit(1);
    });

    // Start the server
    await server.start();
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

main();
