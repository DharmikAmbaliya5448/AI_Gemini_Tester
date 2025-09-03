// agents/testGeneratorAgent.js
// This agent is responsible for calling the LLM to generate unit tests.

const { ChatGoogleGenerativeAI } = require("@langchain/google-genai");
const { SystemMessage, HumanMessage } = require("@langchain/core/messages");
const config = require("../config");

// Initialize the Gemini model
const model = new ChatGoogleGenerativeAI({
  apiKey: config.geminiApiKey,
  modelName: config.llmModelName,
  temperature: 0.4, // Lower temperature for more deterministic code generation
});

/**
 * Creates a detailed prompt for the LLM to generate tests.
 * @param {object} state - The current state of the graph.
 * @returns {Array<BaseMessage>} - An array of messages for the LLM.
 */
const createTestGenerationPrompt = (state) => {
  const { filePath, fileContent, feedback, iterationCount } = state;

  const systemMessage = `You are an expert software engineer specializing in writing comprehensive and robust unit tests using the ${config.testingFramework} framework.
Your task is to generate a complete test file for the provided code.
Your response MUST be ONLY the JavaScript code for the test file, enclosed in a single markdown code block (e.g., \`\`\`javascript\n...\`\`\`).
Do not include any explanations, apologies, or introductory text. Just the code.
Ensure you cover all functions, methods, edge cases, and potential error conditions. The goal is to achieve high test coverage.`;

  let userQuery;
  if (iterationCount > 0) {
    // This is a regeneration attempt based on feedback
    userQuery = `The previous test generation attempt for the file \`${filePath}\` did not achieve the required test coverage.
Feedback from the coverage analysis: "${feedback}"
Please regenerate the tests, paying close attention to the feedback to improve coverage.
Here is the original code again:
\`\`\`javascript
${fileContent}
\`\`\`
`;
  } else {
    // This is the first attempt
    userQuery = `Generate a complete ${config.testingFramework} test file for the following code from \`${filePath}\`:
\`\`\`javascript
${fileContent}
\`\`\`
`;
  }

  return [new SystemMessage(systemMessage), new HumanMessage(userQuery)];
};

/**
 * The agent function that invokes the LLM to generate tests.
 * @param {object} state - The current state of the graph.
 * @returns {Promise<object>} - A partial state object with the generated test.
 */
async function testGeneratorAgent(state) {
  console.log("AGENT: Generating tests...");
  const prompt = createTestGenerationPrompt(state);
  const response = await model.invoke(prompt);

  // Extract code from the markdown block
  const rawContent = response.content;
  const codeBlockMatch = rawContent.match(/```javascript\n([\s\S]*?)\n```/);
  const generatedTest = codeBlockMatch ? codeBlockMatch[1].trim() : "";

  if (!generatedTest) {
    console.error("Generator agent failed to produce a valid code block.");
    return {
      generatedTest: null,
      feedback: "LLM did not return a valid code block.",
    };
  }

  return { generatedTest };
}

module.exports = { testGeneratorAgent };
