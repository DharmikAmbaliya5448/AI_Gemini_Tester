// config.js
// Central configuration for the AI test generator.
// Use environment variables for sensitive data like API keys.
require("dotenv").config();

module.exports = {
  // Gemini API Key - IMPORTANT: Store this in a .env file
  geminiApiKey: process.env.GEMINI_API_KEY,

  // Test coverage threshold. The mutation agent will trigger if coverage is below this.
  coverageThreshold: 80,

  // Supported file extensions for test generation
  supportedFileExtensions: [".js", ".ts"],

  // Glob patterns to ignore files and directories
  ignorePatterns: [
    "node_modules/**",
    "**/*.test.js",
    "**/*.spec.js",
    "jest.config.js",
    "coverage/**",
  ],

  // The testing framework to be used in prompts
  testingFramework: "Jest",

  // Maximum number of times the coverage agent will ask for regeneration
  maxRegenerationAttempts: 3,

  // The model to use for generation
  llmModelName: "gemini-2.5-flash-preview-05-20",
};
