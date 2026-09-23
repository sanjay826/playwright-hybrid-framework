import { test, expect } from "@playwright/test";
import { WorkOrderListingPageSteps } from "../../../../page-object/page-steps/workorderlisting-page-steps.ts";
import { AuthCommon } from "../../../../commons/ui/auth-common.ts";
import { log } from "../../../../utilities/logger.ts";

let workOrderListingPage: WorkOrderListingPageSteps;

test.describe(
  "Work Order Listings Tests",
  { tag: ["@workorderlistings", "@ui"] },
  () => {
    //initialize page objects before each test
    test.beforeEach(async ({ page }) => {
      await test.step("Login (cached or fresh) and land on dashboard", async () => {
        // Use common authentication helper to perform login once
        const authCommon = new AuthCommon(page);
        await authCommon.performLogin();
        workOrderListingPage = new WorkOrderListingPageSteps(page);
        await workOrderListingPage.navigateToWorkOrderListingPage();
      });
    });

    /** Test case -1 Verify that the work order listings page loads correctly with Page Headers */
    test(
      "TC-WOLTS-01 | Verify that the work order listings page loads correctly with Page Headers",
      { tag: ["@TC-WOLTS-01", "@regression"] },
      async () => {
        log.info(
          "Running TC-WOLTS-01 | Verify work order listings page headers",
        );
        await test.step("Verify work order listings page is displayed with Headers", async () => {
          await workOrderListingPage.verifyWorkOrderListingPageHeaderIsVisible();
        });
      },
    );
    /** Test case -2 Verify that all work order state tabs are visible */
    test(
      "TC-WOLTS-02 | Verify that all work order state tabs are visible",
      { tag: ["@TC-WOLTS-02", "@regression"] },
      async () => {
        log.info(
          "Running TC-WOLTS-02 | Verify all work order state tabs are visible",
        );
        await test.step("Verify all work order state tabs are displayed", async () => {
          await workOrderListingPage.verifyAllWorkOrderStateTabsAreVisible();
        });
      },
    );

    test(
      "TC-WOLTS-03 | Verify Drafted work order search functionality ",
      { tag: ["@TC-WOLTS-03", "@regression"] },
      async () => {
        log.info(
          "Running TC-WOLTS-03 | Verify Drafted work order search functionality",
        );
        await test.step("Select Sample type from dropdown successfully", async () => {
          await workOrderListingPage.selectSampleTypeFromDropdown("Tissue");
        });
        await test.step("Enter work order name in WO Name field successfully", async () => {
          await workOrderListingPage.enterWorkOrderNameInWONameField(
            "WORK ORder 001",
          );
        });
      },
    );
  },
);
