# Test Execution Command Reference

This document contains the supported setup, validation, Playwright, and JMeter commands for the framework.

## Project Setup

```powershell
# Install the dependencies declared in package.json.
npm install

# Install the browser binaries required by the configured Playwright projects.
npx playwright install chromium firefox
```

For a clean CI installation:

```powershell
# Install the exact dependency versions from package-lock.json.
npm ci

# Install Playwright browsers for the CI environment.
npx playwright install chromium firefox
```

## Code Validation

```powershell
# Check TypeScript without generating JavaScript files.
npm run type-check

# Check formatting for TypeScript and JSON files.
npm run lint
```

To format files automatically:

```powershell
# Apply the repository's Prettier formatting rules.
npx prettier --write "**/*.{ts,json}"
```

## Environment Configuration

Stage is the default environment. Credentials should be supplied through a local `.env` file, PowerShell environment variables, or CI secrets. Do not commit real credentials.

```powershell
# Select the stage environment and provide the stage login credentials.
$env:TEST_ENV = "stage"
$env:STAGE_USERNAME = "your-stage-username"
$env:STAGE_PASSWORD = "your-stage-password"

# Run the complete suite with the selected environment.
npm test
```

For QA or production UI execution:

```powershell
# Run the QA UI suite using the QA-specific configuration variables.
$env:TEST_ENV = "qa"
$env:QA_APP_URL = "https://your-qa-host"
$env:QA_USERNAME = "your-qa-username"
$env:QA_PASSWORD = "your-qa-password"
npm run test:ui

# Run the production UI suite using the production-specific credentials.
$env:TEST_ENV = "production"
$env:PRODUCTION_USERNAME = "your-production-username"
$env:PRODUCTION_PASSWORD = "your-production-password"
npm run test:ui
```

The runtime configuration checks environment-specific variables first, followed by generic fallbacks such as `USERNAME`, `PASSWORD`, `APP_URL`, and `API_BASE_URL`.

## Playwright Test Commands

```powershell
# Run all tests under the configured testDir: ./tests.
npm test

# Run a single test specification.
npx playwright test tests/ui/features/login/login-tests.spec.ts

# Run all tests in a component folder.
npx playwright test tests/api

# Run all UI tests in Chromium.
npm run test:ui

# Run smoke tests in Chromium.
npm run test:smoke

# Run regression tests in Chromium.
npm run test:regression

# Run the API test suite.
npm run test:api
```

## Browser Projects

The Playwright configuration defines `chromium` and `firefox` projects.

```powershell
# Run the selected test in Chromium.
npx playwright test --project=chromium

# Run the selected test in Firefox.
npx playwright test --project=firefox

# Run with a visible browser window for local investigation.
npx playwright test --headed --project=chromium

# Run without a visible browser window. This is the configured default.
npx playwright test --headless --project=chromium
```

## Test Selection

```powershell
# Run tests whose title contains the specified text.
npx playwright test --grep "Verify login"

# Run tests tagged as smoke tests.
npx playwright test --grep @smoke --project=chromium

# Run tests tagged as regression tests.
npx playwright test --grep @regression --project=chromium

# Run tests tagged as UI tests.
npx playwright test --grep @ui --project=chromium

# List matching tests without executing them.
npx playwright test --list --grep @smoke
```

The repository currently uses `@smoke`, `@regression`, and `@ui` tags. A `@sanity` tag is not currently defined in the test specifications.

## Debugging and Interactive Execution

```powershell
# Open Playwright Inspector and pause test execution for interactive debugging.
npx playwright test --debug

# Open Playwright UI Mode for filtering and interactive test execution.
npx playwright test --ui

# Run tests sequentially, which can simplify troubleshooting shared-state issues.
npx playwright test --workers=1

# Run with a fixed number of parallel workers.
npx playwright test --workers=4
```

## Retry and Repetition

```powershell
# Retry failed tests twice for this command.
npx playwright test --retries=2

# Re-run only tests that failed in the previous run.
npx playwright test --last-failed

# Execute each test three times to detect intermittent failures.
npx playwright test --repeat-each=3
```

The Playwright configuration already enables two retries in CI and no retries locally.

## Reports and Artifacts

```powershell
# Run tests with the default configured reporters.
npm test

# Generate and open the HTML report after a test run.
npx playwright show-report

# Open a trace file generated for a failed or retried test.
npx playwright show-trace path\to\trace.zip
```

The configured reporters write the HTML report to `playwright-report/` and JSON results to `playwright-reports.json`. Failure screenshots, videos, and traces are stored under `test-results/` according to `playwright.config.ts`.

## Snapshot Testing

```powershell
# Update approved snapshots after intentionally changing the expected UI.
npx playwright test --update-snapshots
```

Review snapshot changes carefully before committing them.

## JMeter Load Testing

JMeter is included under `tests/load/jmeter/`, and the test plan is `tests/load/testplans/LoadTest01.jmx`.

```powershell
# Run the load test in non-GUI mode and save sample results.
.\tests\load\jmeter\bin\jmeter.bat -n `
  -t .\tests\load\testplans\LoadTest01.jmx `
  -l .\tests\load\jmeter\results\load-test-results.jtl

# Run the load test and generate an HTML dashboard report.
.\tests\load\jmeter\bin\jmeter.bat -n `
  -t .\tests\load\testplans\LoadTest01.jmx `
  -l .\tests\load\jmeter\results\load-test-results.jtl `
  -e -o .\tests\load\jmeter\report-output\load-test-report
```

The output report directory must be empty or removed before generating a new JMeter dashboard.

## Version and Installation Checks

```powershell
# Display the installed Playwright version.
npx playwright --version

# Install or repair the configured Playwright browser binaries.
npx playwright install chromium firefox
```
