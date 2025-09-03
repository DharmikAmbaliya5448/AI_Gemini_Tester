// graph/workflow.js
// Defines the agentic workflow using LangGraph.

const { StateGraph } = require("@langchain/langgraph");
const { testGeneratorAgent } = require("../agents/testGeneratorAgent");
const { coverageAgent, shouldRegenerate } = require("../agents/coverageAgent");

// Define the state structure for our graph
const graphState = {
  filePath: { value: null },
  fileContent: { value: null },
  generatedTest: { value: null },
  coverage: { value: null },
  feedback: { value: null },
  iterationCount: {
    value: (x, y) => x + y,
    default: () => 0,
  },
};

/**
 * Creates and compiles the LangGraph workflow for test generation.
 * @returns {StateGraph} A compiled graph ready to be invoked.
 */
function createTestGenerationWorkflow() {
  const workflow = new StateGraph({
    channels: graphState,
  });

  // 1. Add the Test Generator Node
  workflow.addNode("testGenerator", testGeneratorAgent);

  // 2. Add the Coverage Checker Node
  workflow.addNode("coverageChecker", coverageAgent);

  // 3. Set the Entry Point
  workflow.setEntryPoint("testGenerator");

  // 4. Add the Edges

  // After generating tests, check their coverage
  workflow.addEdge("testGenerator", "coverageChecker");

  // Add the conditional edge for the mutation/regeneration loop
  workflow.addConditionalEdges(
    "coverageChecker", // Source node
    shouldRegenerate, // Function to decide the next path
    {
      regenerate: "testGenerator", // If shouldRegenerate returns 'regenerate', loop back
      __end__: "__end__", // Otherwise, end the workflow
    }
  );

  // Every time we regenerate, we need to increment the counter
  workflow.addNode("incrementer", async (state) => ({ iterationCount: 1 }));
  workflow.addEdge("regenerate", "incrementer");
  workflow.addEdge("incrementer", "testGenerator");

  // Compile the graph into a runnable object
  return workflow.compile();
}

module.exports = { createTestGenerationWorkflow };
