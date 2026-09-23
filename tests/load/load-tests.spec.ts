import { test } from "@playwright/test";
import { JMeterCommons } from "../../commons/jmeter/jmeter-commons.ts";
import { log } from "../../utilities/logger.ts";

test.describe("Nutrisolutions load Tests", () => {
  let jmeter: JMeterCommons;

  test.beforeEach(() => {
    jmeter = new JMeterCommons();
  });

  // Test case -1 Run Jmeter test plan LoadTest.jmx

  test("Run JMeter test plan", async () => {
    test.slow(); // JMeter runs + HTML report generation can exceed the default 120s test timeout
    const jmxFileName = "LoadTest01.jmx";
    log.info("Running Run JMeter test plan");
    await jmeter.runJMeterTestPlan(jmxFileName); // Run the JMeter test plan with the specified file name
  });
});
