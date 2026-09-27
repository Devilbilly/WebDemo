const os = require("os");
const path = require("path");
const { defineConfig, devices } = require("@playwright/test");

module.exports = defineConfig({
  testDir: "tests",
  reporter: "list",
  workers: 2,
  outputDir: path.join(os.tmpdir(), "webdemo-test-results"),
  use: { headless: true },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
