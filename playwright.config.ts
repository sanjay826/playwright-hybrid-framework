import { defineConfig, devices } from "@playwright/test";
import dotenv from "dotenv";

dotenv.config({ override: !process.env.CI });

export default defineConfig({
  testDir: "./tests",
  timeout: 60_0000 /* Global timeout for each test */,
  expect: { timeout: 15_000 },
  fullyParallel: true /* Run tests in files in parallel */,
  forbidOnly:
    !!process.env
      .CI /* Fail the build on CI if you accidentally left test.only in the source code. */,
  retries: process.env.CI ? 2 : 0 /* Retry on CI only */,
  workers: process.env.CI
    ? 1
    : (undefined as any) /* Opt out of parallel tests on CI. */,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  // 'list' with printSteps prints each test.step() to the terminal as it completes, plus the html report
  reporter: [
    ["list", { printSteps: true }],
    ["./utilities/logger.ts"],
    ["html"],
    ["json", { outputFile: "playwright-reports.json" }],
  ],
  use: {
    actionTimeout: 30000,
    navigationTimeout: 60000,
    headless: true,
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    trace: "on-first-retry",
  },
  /* Configure projects for major browsers */
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
  ],
});
