#!/usr/bin/env node

/**
 * Progress Update Script
 * Updates PROGRESS.md with current status
 */

const fs = require("fs");
const path = require("path");

const progressFile = path.join(__dirname, "..", "PROGRESS.md");

function updateProgress(phaseNumber, taskId, status) {
  try {
    let content = fs.readFileSync(progressFile, "utf8");
    const timestamp = new Date().toISOString().split("T")[0];

    // Update last updated timestamp
    content = content.replace(
      /\*\*Last Updated\*\*: .*/,
      `**Last Updated**: ${timestamp}`
    );

    // Update task status
    const taskPattern = new RegExp(
      `(- \\[ \\] \\*\\*${phaseNumber}\\.${taskId}\\*\\* .*\\()\\d+%\\)`,
      "g"
    );
    content = content.replace(taskPattern, `$1${status}%)`);

    // Calculate phase completion
    const phasePattern = new RegExp(
      `### .*Phase ${phaseNumber}:.*\\n\\*\\*Status\\*\\*: .*\\((\\d+)%\\)`,
      "i"
    );
    // (This would need more sophisticated calculation)

    fs.writeFileSync(progressFile, content, "utf8");
    console.log(`✅ Updated task ${phaseNumber}.${taskId} to ${status}%`);
  } catch (error) {
    console.error("❌ Failed to update progress:", error.message);
    process.exit(1);
  }
}

function addLogEntry(message) {
  try {
    let content = fs.readFileSync(progressFile, "utf8");
    const timestamp = new Date().toISOString().split("T")[0];

    // Find the Recent Updates section
    const updatesSection = /## 📝 Recent Updates\n\n/;
    const newEntry = `### ${timestamp}\n${message}\n\n`;

    content = content.replace(updatesSection, `$&${newEntry}`);

    fs.writeFileSync(progressFile, content, "utf8");
    console.log(`✅ Added log entry: ${message}`);
  } catch (error) {
    console.error("❌ Failed to add log entry:", error.message);
    process.exit(1);
  }
}

// CLI interface
const command = process.argv[2];
const args = process.argv.slice(3);

if (command === "update") {
  const [phase, task, status] = args;
  updateProgress(phase, task, status);
} else if (command === "log") {
  const message = args.join(" ");
  addLogEntry(message);
} else if (command === "summary") {
  console.log("📊 Progress Summary");
  console.log("See PROGRESS.md for full details");
} else {
  console.log(`
Usage:
  node scripts/update-progress.js update <phase> <task> <status>
  node scripts/update-progress.js log <message>
  node scripts/update-progress.js summary

Examples:
  node scripts/update-progress.js update 1 1 50
  node scripts/update-progress.js log "Completed XSS vulnerability fixes"
  node scripts/update-progress.js summary
  `);
}
