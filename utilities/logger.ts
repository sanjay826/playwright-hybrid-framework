import winston from "winston";
import type { Reporter, TestCase, TestResult } from "@playwright/test/reporter";
import TransportStream from "winston-transport";

const messageSymbol = Symbol.for("message");

class TestLogTransport extends TransportStream {
  entries: string[] = [];

  log(info: unknown, callback: () => void): void {
    const entry = info as Record<PropertyKey, unknown>;
    this.entries.push(String(entry[messageSymbol] ?? JSON.stringify(info)));
    callback();
  }
}

const testLogTransport = new TestLogTransport();

const log = winston.createLogger({
  level: process.env.LOG_LEVEL ?? "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
  ),
  transports: [new winston.transports.Console(), testLogTransport],
});

class TestLoggerReporter implements Reporter {
  onTestBegin(test: TestCase): void {
    testLogTransport.entries = [];
    log.info("Test started", {
      test: test.titlePath().join(" > "),
      file: test.location.file,
      line: test.location.line,
    });
  }

  onTestEnd(test: TestCase, result: TestResult): void {
    const testName = test.titlePath().join(" > ");
    const metadata = {
      test: testName,
      file: test.location.file,
      status: result.status,
      duration: result.duration,
      retry: result.retry,
    };

    result.attachments.push({
      name: "winston-log",
      contentType: "text/plain",
      body: Buffer.from(testLogTransport.entries.join("\n"), "utf8"),
    });

    if (result.status === "failed" || result.status === "timedOut") {
      log.error("Test failed", {
        ...metadata,
        errors: result.errors.map((error) => error.message),
      });
      return;
    }

    log.info(`Test ${result.status}`, metadata);
  }
}

export { log };
export default TestLoggerReporter;
