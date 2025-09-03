// utils/fileHelper.js
// Provides utilities for file I/O and for running tests to get coverage reports.

const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");
const util = require("util");

const execPromise = util.promisify(exec);

/**
 * Writes the generated test code to the appropriate test file.
 * @param {string} sourceFilePath - The path of the original source file.
 * @param {string} testContent - The content of the generated test.
 * @returns {string} The path to the newly created test file.
 */
function writeTestFile(sourceFilePath, testContent) {
  const dir = path.dirname(sourceFilePath);
  const baseName = path.basename(sourceFilePath, path.extname(sourceFilePath));
  // Standard naming convention, e.g., myComponent.js -> myComponent.test.js
  const testFilePath = path.join(dir, `${baseName}.test.js`);

  // Simple overwrite. For appending, you would read the existing file first.
  fs.writeFileSync(testFilePath, testContent, "utf-8");
  console.log(`Test file written to: ${testFilePath}`);
  return testFilePath;
}

/**
 * Runs Jest for a specific test file and parses the coverage report.
 * @param {string} testFilePath - The path to the test file to run.
 * @returns {Promise<number>} - The line coverage percentage for the source file.
 */
async function runTestsAndGetCoverage(testFilePath) {
  // Command to run Jest with coverage and JSON output for a single file
  const command = `jest ${testFilePath} --coverage --json --silent`;

  try {
    const { stdout } = await execPromise(command);
    const result = JSON.parse(stdout);

    if (result.coverageMap) {
      const sourceFilePath = testFilePath.replace(".test.js", ".js");
      const fileCoverage = Object.values(result.coverageMap).find(
        (cov) => cov.path === path.resolve(sourceFilePath)
      );

      if (fileCoverage) {
        return fileCoverage.lines.pct;
      }
    }
    return 0; // Return 0 if no coverage data is found
  } catch (error) {
    // Jest exits with a non-zero code if tests fail, which execPromise treats as an error.
    // We can still try to parse coverage from stdout if it exists.
    if (error.stdout) {
      try {
        const result = JSON.parse(error.stdout);
        if (result.coverageMap) {
          const sourceFilePath = testFilePath.replace(".test.js", ".js");
          const fileCoverage = Object.values(result.coverageMap).find(
            (cov) => cov.path === path.resolve(sourceFilePath)
          );
          if (fileCoverage) {
            console.log("Tests failed, but coverage data was extracted.");
            return fileCoverage.lines.pct;
          }
        }
      } catch (parseError) {
        console.error(
          "Tests failed and could not parse JSON output.",
          parseError.message
        );
        return 0;
      }
    }
    console.error(
      `Error running tests for ${testFilePath}. Tests may be failing.`
    );
    return 0; // Return 0 if tests fail to run or parse
  }
}

module.exports = { writeTestFile, runTestsAndGetCoverage };
