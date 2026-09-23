import { test } from "@playwright/test";
import { AuthCommon } from "../../../../commons/ui/auth-common.ts";
import { LabSetupSteps } from "../../../../page-object/page-steps/lab-setup-steps.ts";
import { log } from "../../../../utilities/logger.ts";

let labSetup: LabSetupSteps;

test.describe(
  "Nutrisolutions Lab Setup Tests",
  { tag: ["@labsetup", "@ui"] },
  () => {
    test.beforeEach(async ({ page }) => {
      await test.step("Login and navigate to Lab Setup page", async () => {
        const authCommon = new AuthCommon(page);
        await authCommon.performLogin();
        labSetup = new LabSetupSteps(page);
        await labSetup.navigateToLabSetupPage();
      });
    });

    /** Test case -1: verify all Lab Setup page elements and data. */
    test(
      "TC-LAB-SETUP-01 | Verify Lab Setup page elements and data",
      { tag: ["@TC-LAB-SETUP-01", "@regression"] },
      async () => {
        log.info(
          "Running TC-LAB-SETUP-01 | Verify Lab Setup page elements and data",
        );
        await test.step("Verify Lab Setup page elements and data", async () => {
          await labSetup.verifyLabSetupPageElements();
        });
      },
    );

    /** Test case -2: add and save a Lab Setup record with a unique account code. */
    test(
      "TC-LAB-SETUP-02 | Add and save a new Lab Setup",
      { tag: ["@TC-LAB-SETUP-02", "@regression"] },
      async () => {
        log.info("Running TC-LAB-SETUP-02 | Add and save a new Lab Setup");
        await test.step("Add and save a new Lab Setup", async () => {
          await labSetup.addNewLabSetup();
        });
      },
    );
  },
);
