// index.js
// This is the main entry point for the test generation process.
// It determines whether to run in 'backfill' or 'incremental' mode.

const { glob } = require("glob");
const path = require("path");
const fs = require("fs");
const { getChangedFiles } = require("./utils/gitHelper");
const { createTestGenerationWorkflow } = require("./graph/workflow");
const config = require("./config");

/**
 * Processes a single file: reads its content and invokes the test generation workflow.
 * @param {string} filePath - The path to the source code file.
 */
async function processFile(filePath) {
  console.log(`\nProcessing file: ${filePath}`);
  try {
    const fileContent = fs.readFileSync(filePath, "utf-8");

    // Skip empty files
    if (!fileContent.trim()) {
      console.log(`Skipping empty file: ${filePath}`);
      return;
    }

    const testGenerationWorkflow = createTestGenerationWorkflow();

    const initialState = {
      filePath,
      fileContent,
      generatedTest: null,
      coverage: 0,
      feedback: "Initial test generation.",
      iterationCount: 0,
    };

    const finalState = await testGenerationWorkflow.invoke(initialState);

    if (
      finalState.generatedTest &&
      finalState.coverage >= config.coverageThreshold
    ) {
      console.log(
        `✅ Successfully generated tests for ${filePath} with ${finalState.coverage.toFixed(
          2
        )}% coverage.`
      );
    } else if (finalState.generatedTest) {
      console.log(
        `⚠️ Generated tests for ${filePath}, but coverage is low (${finalState.coverage.toFixed(
          2
        )}%).`
      );
    } else {
      console.error(
        `❌ Failed to generate tests for ${filePath} after multiple attempts.`
      );
    }
  } catch (error) {
    console.error(`Error processing file ${filePath}:`, error);
  }
}

/**
 * Main function to orchestrate the test generation process.
 */
async function main() {
  // The command line arguments determine the mode.
  // Example for incremental: node index.js HEAD~1 HEAD
  // Example for backfill:   node index.js
  const args = process.argv.slice(2);

  if (!config.geminiApiKey) {
    console.error(
      "GEMINI_API_KEY is not set. Please create a .env file and add your API key."
    );
    return;
  }

  if (args.length === 2) {
    // Incremental mode: Get changed files between two commits
    const [fromCommit, toCommit] = args;
    console.log(
      `🚀 Starting incremental test generation from ${fromCommit} to ${toCommit}...`
    );
    const changedFiles = await getChangedFiles(fromCommit, toCommit);

    const relevantFiles = changedFiles.filter(
      (file) =>
        config.supportedFileExtensions.includes(path.extname(file.path)) &&
        !config.ignorePatterns.some((pattern) =>
          new RegExp(pattern.replace("**", ".*")).test(file.path)
        )
    );

    console.log(`Found ${relevantFiles.length} relevant changed files.`);

    for (const file of relevantFiles) {
      // We only generate tests for added or modified files.
      // Deletion logic would involve finding and removing the corresponding test file.
      if (file.status === "added" || file.status === "modified") {
        await processFile(file.path);
      } else if (file.status === "deleted") {
        const testFilePath = file.path.replace(".js", ".test.js"); // simplistic
        if (fs.existsSync(testFilePath)) {
          fs.unlinkSync(testFilePath);
          console.log(`🗑️  Deleted test file: ${testFilePath}`);
        }
      }
    }
  } else {
    // Backfill mode: Find all relevant files in the project
    console.log(
      "🚀 Starting backfill test generation for the entire project..."
    );
    const files = await glob("**/*", {
      nodir: true,
      ignore: config.ignorePatterns,
    });
    const relevantFiles = files.filter((file) =>
      config.supportedFileExtensions.includes(path.extname(file))
    );

    console.log(`Found ${relevantFiles.length} relevant files to process.`);
    for (const file of relevantFiles) {
      await processFile(file);
    }
  }

  console.log("\n✨ Test generation process complete.");
}

main().catch(console.error);
