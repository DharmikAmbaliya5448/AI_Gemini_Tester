// agents/coverageAgent.js
// This agent runs the generated tests, checks coverage, and provides feedback for regeneration.

const {
  writeTestFile,
  runTestsAndGetCoverage,
} = require("../utils/fileHelper");
const config = require("../config");

/**
 * The agent function that checks test coverage.
 * @param {object} state - The current state of the graph.
 * @returns {Promise<object>} - A partial state object with coverage and feedback.
 */
async function coverageAgent(state) {
  console.log("AGENT: Checking test coverage...");
  const { filePath, generatedTest } = state;

  if (!generatedTest) {
    console.log("No test content to check. Skipping coverage analysis.");
    return {
      coverage: 0,
      feedback: "Test generation failed, so no coverage could be calculated.",
    };
  }

  try {
    const testFilePath = writeTestFile(filePath, generatedTest);
    const coverage = await runTestsAndGetCoverage(testFilePath);
    console.log(`Coverage for ${filePath}: ${coverage.toFixed(2)}%`);

    let feedback = `Coverage is ${coverage.toFixed(2)}%, which meets the ${
      config.coverageThreshold
    }% threshold.`;
    if (coverage < config.coverageThreshold) {
      // In a more advanced system, you'd analyze the coverage report
      // to find which specific lines/branches are not covered and provide that as feedback.
      feedback = `The current coverage is ${coverage.toFixed(
        2
      )}%, which is below the required ${
        config.coverageThreshold
      }%. Please generate more tests to cover untested logic, branches, and edge cases.`;
    }

    return { coverage, feedback };
  } catch (error) {
    console.error("Error during coverage analysis:", error);
    return {
      coverage: 0,
      feedback:
        "An error occurred while running the tests. The generated tests might be invalid or have syntax errors.",
    };
  }
}

/**
 * A conditional logic function that decides the next step in the graph.
 * @param {object} state - The current state of the graph.
 * @returns {string} - The name of the next node to execute ('regenerate' or '__end__').
 */
function shouldRegenerate(state) {
  console.log("ROUTER: Deciding next step...");
  const { coverage, iterationCount } = state;

  if (
    coverage < config.coverageThreshold &&
    iterationCount < config.maxRegenerationAttempts
  ) {
    console.log(
      `Coverage (${coverage.toFixed(2)}%) is below threshold (${
        config.coverageThreshold
      }%). Regenerating...`
    );
    return "regenerate";
  } else {
    console.log("Coverage target met or max attempts reached. Finishing.");
    return "__end__";
  }
}

module.exports = { coverageAgent, shouldRegenerate };
