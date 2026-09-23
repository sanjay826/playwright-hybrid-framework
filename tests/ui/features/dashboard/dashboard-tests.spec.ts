import { test } from "@playwright/test";
import { AuthCommon } from "../../../../commons/ui/auth-common.ts";
import { HomePageSteps } from "../../../../page-object/page-steps/home-page-steps.ts";
import { log } from "../../../../utilities/logger.ts";

let homePage: HomePageSteps;

test.describe(
  "Nutrisolutions Dashboard Tests",
  { tag: ["@dashboard", "@ui"] },
  () => {
    //initialize page objects and perform login before each test
    test.beforeEach(async ({ page }) => {
      await test.step("Login (cached or fresh) and land on dashboard", async () => {
        // Use common authentication helper to perform login once
        const authCommon = new AuthCommon(page);
        homePage = await authCommon.performLogin();
      });
    });

    /** Test case -1 : verify all header links are displayed on dashboard */
    test(
      "TC-DB-01 | Verify all header links are displayed",
      { tag: ["@TC-DB-01", "@regression"] },
      async () => {
        log.info("Running TC-DB-01 | Verify all header links are displayed");
        await test.step("Verify all header links are displayed", async () => {
          await homePage.verifyAllHeaderLinksText();
        });
      },
    );

    /** Test case -2 : verify work order status section */
    test(
      "TC-DB-02 | Verify work order status section",
      { tag: ["@TC-DB-02", "@regression"] },
      async () => {
        log.info("Running TC-DB-02 | Verify work order status section");
        await test.step("Verify work order status section", async () => {
          await homePage.verifyWorkOrderStatusSection();
          await homePage.verifyArrowForwordIconNavgateToWorkOrderListingsScreen();
          await homePage.verifyWorkOrderStatusChartSelectionYearWize();
          await homePage.verifyWorkOrderStatusTableCellValues();
        });
      },
    );

    /** Test case -3 : verify User Listing section */
    test(
      "TC-DB-03 | Verify user Listing section",
      { tag: ["@TC-DB-03", "@regression"] },
      async () => {
        log.info("Running TC-DB-03 | Verify user Listing section");
        await test.step("Verify user listing section", async () => {
          await homePage.verifyHeaderInUserListingSection();
          await homePage.verifyArrowForwordIconNavgateToUserListingsScreen();
          await homePage.verifyUserListingTableSectionHeaders();
          await homePage.verifyUserListingTableCellValues();
        });
      },
    );

    /** Test Case -4 : Verify Lab Setup section */
    test(
      "TC-DB-04 | Verify Lab Setup section",
      { tag: ["@TC-DB-04", "@regression"] },
      async () => {
        log.info("Running TC-DB-04 | Verify Lab Setup section");
        await test.step("Verify Lab Setup section", async () => {
          await homePage.verifyLabSetupSectionHeadingTextSection();
          await homePage.verifyLabSetupArrowIconNavigateToLabSetupPage();
          await homePage.verifyLabSetupTableHeaders();
          await homePage.verifyLabSetupTableCellValues();
        });
      },
    );
    /** Test Case -5 : Verify Recently Created Work Orders section */
    test(
      "TC-DB-05 | Verify Recently Created Work Orders section",
      { tag: ["@TC-DB-05", "@regression"] },
      async () => {
        log.info(
          "Running TC-DB-05 | Verify Recently Created Work Orders section",
        );
        await test.step("Verify Recently Created Work Orders section", async () => {
          await homePage.verifyRecentlyCreatedWorkOrderTextHeader();
          await homePage.verifyWorkOrderListingPageNavigationFromRecentWorkOrder();
          await homePage.verifyRecentlyCreatedWorkOrderTableHeaders();
        });
      },
    );
  },
);
