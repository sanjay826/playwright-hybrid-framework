import { Page, expect } from "@playwright/test";
import { WebCommons } from "../../commons/ui/web-commons.ts";
import homePage from "../page-elements/home-page-elements.json" with { type: "json" };
import WoListingPage from "../page-elements/workorderlisting-page-element.json" with { type: "json" };
import testData from "../../testdata/ui/data.json" with { type: "json" };
import { TIMEOUTS } from "../../config/config-timouts.ts";

export class WorkOrderListingPageSteps {
  page: Page;
  web: WebCommons;

  constructor(page: Page) {
    this.page = page;
    this.web = new WebCommons(page);
  }

  /** Navigate to the Work Order Listing page. */
  async navigateToWorkOrderListingPage(): Promise<void> {
    await this.web.clickElement(homePage.workOrderListingButton);

    const workOrderListingPageHeaderConfig =
      WoListingPage.workOrderListingPageHeader;
    const workOrderListingPageHeader = await this.web.getElementLocator(
      workOrderListingPageHeaderConfig.locator,
      workOrderListingPageHeaderConfig.locatorType,
      { role: "heading", name: workOrderListingPageHeaderConfig.name },
    );
    await expect(workOrderListingPageHeader).toBeVisible({
      timeout: TIMEOUTS.LONG,
    });
  }
  async verifyWorkOrderListingPageHeaderIsVisible(): Promise<void> {
    const workOrderListingPageHeadersConfig =
      WoListingPage.workOrderListingPageHeader;
    const workOrderListingPageHeaders = await this.web.getElementLocator(
      workOrderListingPageHeadersConfig.locator,
      workOrderListingPageHeadersConfig.locatorType,
      { role: "heading", name: "Work Order Listings" },
    );
    await expect(workOrderListingPageHeaders).toBeVisible();
    const addWorkOrderButtonConfig = WoListingPage.addNewWorkOrderButton;
    const addWorkOrderButton = await this.web.getElementLocator(
      addWorkOrderButtonConfig.locator,
      addWorkOrderButtonConfig.locatorType,
      { role: "button", name: "Add Work Order" },
    );
    await expect(addWorkOrderButton).toBeVisible();
  }
  async verifyAllWorkOrderStateTabsAreVisible(): Promise<void> {
    const expectedTabs =
      testData["Verify Work Order Listings page"].expectedWorkOrderStateTabs;
    const actualTabs = await this.web.getAllTextContentElement(
      WoListingPage.allWorkOrderStats,
    );
    expect(actualTabs).toEqual(expectedTabs);
  }
  async selectSampleTypeFromDropdown(sampleType: string): Promise<void> {
    const sampleTypeDropdownConfig = WoListingPage.sampleTypeDropdown;
    await this.web.selectOption(sampleTypeDropdownConfig.locator, {
      label: sampleType,
    });
  }
  async enterWorkOrderNameInWONameField(workOrderName: string): Promise<void> {
    const woNameFieldConfig = WoListingPage.woNameField;
    const woNameField = await this.web.getElementLocator(
      woNameFieldConfig.locator,
      woNameFieldConfig.locatorType,
      { exact: woNameFieldConfig.exact },
    );
    await woNameField.fill(workOrderName);
  }
}
