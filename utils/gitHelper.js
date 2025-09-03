// utils/gitHelper.js
// Contains functions for interacting with Git to detect file changes.

const simpleGit = require("simple-git");
const git = simpleGit();

/**
 * Uses git diff to find files that have been added, modified, or deleted between two commits.
 * @param {string} fromCommit - The starting commit hash.
 *- @param {string} toCommit - The ending commit hash.
 * @returns {Promise<Array<{path: string, status: 'added'|'modified'|'deleted'}>>} - A list of changed files.
 */
async function getChangedFiles(fromCommit, toCommit) {
  try {
    console.log(`Checking git diff between ${fromCommit} and ${toCommit}...`);
    const diffSummary = await git.diffSummary([
      "--name-status",
      fromCommit,
      toCommit,
    ]);

    const changedFiles = diffSummary.files.map((file) => {
      let status;
      // The status is encoded in the diff-filter format (e.g., A for Added, M for Modified)
      if (file.path.startsWith("A")) status = "added";
      else if (file.path.startsWith("M")) status = "modified";
      else if (file.path.startsWith("D")) status = "deleted";
      else status = "modified"; // Default for other changes like renames.

      // We need to clean the path string which might have status chars
      const cleanedPath = file.path.replace(/^[A-Z]\t/, "").trim();

      return {
        path: cleanedPath,
        status: status,
      };
    });

    // The simple-git diffSummary can be tricky with name-status. A more raw approach:
    const rawDiff = await git.diff(["--name-status", fromCommit, toCommit]);
    const files = rawDiff
      .split("\n")
      .filter((line) => line)
      .map((line) => {
        const [statusChar, path] = line.split("\t");
        let status;
        if (statusChar === "A") status = "added";
        else if (statusChar === "M") status = "modified";
        else if (statusChar === "D") status = "deleted";
        else status = "unknown";
        return { path, status };
      })
      .filter((f) => f.status !== "unknown");

    return files;
  } catch (error) {
    console.error("Error getting git diff:", error);
    return [];
  }
}

module.exports = { getChangedFiles };
