import { test } from "@playwright/test";
import { AuthCommon } from "../../../../commons/ui/auth-common.ts";
import { UserListingPageSteps } from "../../../../page-object/page-steps/user-listing-page-step.ts";
import { log } from "../../../../utilities/logger.ts";

let userListingPage: UserListingPageSteps;

test.describe(
  "Nutrisolutions User Listing Tests",
  { tag: ["@userlisting", "@ui"] },
  () => {
    test.beforeEach(async ({ page }) => {
      await test.step("Login and navigate to User Listing page", async () => {
        const authCommon = new AuthCommon(page);
        await authCommon.performLogin();
        userListingPage = new UserListingPageSteps(page);
        await userListingPage.navigateToUserListingPage();
      });
    });

    /** Test case -1: verify every User Listing page element is displayed. */
    test(
      "TC-USER-LISTING-01 | Verify User Listing page elements",
      { tag: ["@TC-USER-LISTING-01", "@regression"] },
      async () => {
        log.info(
          "Running TC-USER-LISTING-01 | Verify User Listing page elements",
        );
        await test.step("Verify User Listing page elements", async () => {
          await userListingPage.verifyUserListingPageElements();
        });
      },
    );
  },
);
