import { expect, Page } from "@playwright/test";
import { WebCommons } from "../../commons/ui/web-commons.ts";
import homePage from "../page-elements/home-page-elements.json" with { type: "json" };
import userListingPage from "../page-elements/user-listing-page-element.json" with { type: "json" };
import { TIMEOUTS } from "../../config/config-timouts.ts";

export class UserListingPageSteps {
  page: Page;
  web: WebCommons;

  constructor(page: Page) {
    this.page = page;
    this.web = new WebCommons(page);
  }

  /** Navigate to the User Listing page. */
  async navigateToUserListingPage(): Promise<void> {
    await this.web.clickElement(homePage.usersListingButton);
    const userListingPageHeading = await this.web.getElementLocator(
      userListingPage.userListingPageHeading.locator,
      userListingPage.userListingPageHeading.locatorType,
      {
        role: userListingPage.userListingPageHeading.role,
        name: userListingPage.userListingPageHeading.name,
      },
    );
    await expect(userListingPageHeading).toBeVisible({
      timeout: TIMEOUTS.LONG,
    });
  }

  /** Verify the User Listing page heading, table, headers, and data rows. */
  async verifyUserListingPageElements(): Promise<void> {
    const pageHeading = await this.web.getElementLocator(
      userListingPage.userListingPageHeading.locator,
      userListingPage.userListingPageHeading.locatorType,
      {
        role: userListingPage.userListingPageHeading.role,
        name: userListingPage.userListingPageHeading.name,
      },
    );
    await expect(pageHeading).toBeVisible();

    await this.web.verifyElementVisibility(
      userListingPage.userListingTable,
      true,
    );

    const userHeader = await this.web.getElementLocator(
      userListingPage.userListingUserHeader.locator,
      userListingPage.userListingUserHeader.locatorType,
      {
        role: userListingPage.userListingUserHeader.role,
        name: userListingPage.userListingUserHeader.name,
      },
    );
    await expect(userHeader).toBeVisible();

    const roleHeader = await this.web.getElementLocator(
      userListingPage.userListingRoleHeader.locator,
      userListingPage.userListingRoleHeader.locatorType,
      {
        role: userListingPage.userListingRoleHeader.role,
        name: userListingPage.userListingRoleHeader.name,
      },
    );
    await expect(roleHeader).toBeVisible();

    const tableRows = this.page.locator(userListingPage.userListingTableRows);
    await expect(tableRows.first()).toBeVisible({ timeout: TIMEOUTS.LONG });
    expect(await tableRows.count()).toBeGreaterThan(0);
  }
}
