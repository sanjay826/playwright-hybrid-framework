import { Page, expect } from "@playwright/test";
import { WebCommons } from "../../commons/ui/web-commons.ts";
import homePage from "../page-elements/home-page-elements.json" with { type: "json" };
import { TIMEOUTS } from "../../config/config-timouts.ts";

export class HomePageSteps {
  page: Page;
  web: WebCommons;

  constructor(page: Page) {
    this.page = page;
    this.web = new WebCommons(page);
  }

  //Method to verify home logo page is displayed.
  async verifyHomePageIsDisplayed(): Promise<void> {
    await this.web.waitForElementVisible(
      homePage.dashboardButton,
      TIMEOUTS.NAVIGATION,
    );
  }
  // Method to verify home page title is displayed and matches the expected title.and URL is displayed and matches the expected URL.
  async verifyHomePageTitleAndUrl(
    expectedTitle: string,
    expectedUrl: string,
  ): Promise<void> {
    const actualTitle = await this.page.title();
    const actualUrl = this.page.url();
    expect(actualTitle).toBe(expectedTitle);
    expect(actualUrl).toBe(expectedUrl);
  }

  // Method to verify company name headertext is displayed along with update profile link icon.
  async verifyCompanyHeaderTextIsDisplayedWithIcon(): Promise<void> {
    await this.web.verifyElementVisibility(
      homePage.companyNameHeaderText,
      true,
    );
    await this.web.verifyElementVisibility(
      homePage.companyNameHeaderIcon,
      true,
    );
  }
  // Method to verify help link is displayed along with help button
  async verifyHelpLinkIsDisplayedWithIcon(): Promise<void> {
    await this.web.verifyElementVisibility(homePage.helpIcon, true);
    await this.web.verifyElementVisibility(homePage.helpButton, true);
  }
  // Method to verify account circle icon is displayed along with account name
  async verifyAccountCircleIconIsDisplayedWithIcon(): Promise<void> {
    await this.web.verifyElementVisibility(homePage.accountIcon, true);
    await this.web.verifyElementIsEnabled(homePage.accountRetailerName, true);
  }
  // Method to verify logout link is displayed along with logout button
  async verifyLogoutLinkIsDisplayedWithIcon(): Promise<void> {
    await this.web.clickElement(homePage.logOutDropdownIcon);
    await this.web.verifyElementVisibility(homePage.logoutButtonIcon, true);
    await this.web.verifyElementIsEnabled(homePage.logoutButton, true);
    await this.web.pressKey("Escape");
  }
  // Method to verify all header links are displayed and match the expected text.
  async verifyAllHeaderLinksText(): Promise<void> {
    await this.web.verifyText(homePage.dashboardButton, "Dashboard");
    await this.web.verifyText(
      homePage.workOrderListingButton,
      "Work Order Listing",
    );
    await this.web.verifyText(homePage.usersListingButton, "Users Listing");
    await this.web.verifyText(homePage.reportsButton, "Reports");
  }
  // Method to verify list of items which are under Reports dropdown through method verifyReportsDropdownItems through exception.
  async clickReportsDropdownAndVerifyItems(): Promise<void> {
    await this.web.clickElement(homePage.reportsButton);
    const reportsDropdownItems = await this.web.getAllTextContentElement(
      homePage.reportsDropdownItems,
    );
    const expectedItems = [
      "Logout",
      "Search PDF Results",
      "Sample Status summary",
      "Sample Summary and Test Results",
      "Search by Bag QR Code",
      "Nutrients by Sample",
    ]; // Replace with actual expected items
    expect(reportsDropdownItems).toEqual(expectedItems);
    await this.web.pressKey("Escape");
  }

  /** Verifies the Work Order Status chart displays expected status labels*/
  async verifyWorkOrderStatusSection(): Promise<void> {
    const workOrderStatusHeaderConfig = homePage.WorkOrderStatusHeader;
    const workOrderStatusHeader = await this.web.getElementLocator(
      workOrderStatusHeaderConfig.locator,
      workOrderStatusHeaderConfig.locatorType,
      { role: "heading", name: workOrderStatusHeaderConfig.name },
    );
    await expect(workOrderStatusHeader).toBeVisible();
  }
  async verifyArrowForwordIconNavgateToWorkOrderListingsScreen(): Promise<void> {
    const arrowIconConfig = homePage.arrowForwardIconOfWorkOrderStatus;
    const arrowIcon = await this.web.getElementLocator(
      arrowIconConfig.locator,
      arrowIconConfig.locatorType,
    );
    const targetArrowIcon = arrowIcon.nth(arrowIconConfig.nth);
    await expect(targetArrowIcon).toBeVisible();
    await targetArrowIcon.click();
    const workOrderListingPageHeadingConfig =
      homePage.workOrderListingPageHeading;
    const workOrderListingPageHeading = await this.web.getElementLocator(
      workOrderListingPageHeadingConfig.locator,
      workOrderListingPageHeadingConfig.locatorType,
      { role: "heading", name: workOrderListingPageHeadingConfig.name },
    );
    await workOrderListingPageHeading.waitFor({
      state: "visible",
      timeout: TIMEOUTS.LONG,
    });
    await expect(workOrderListingPageHeading).toBeVisible();

    // navigate back to dashboard
    await this.web.clickElement(homePage.dashboardButton);
    await this.web.waitForElementVisible(
      homePage.dashboardButton,
      TIMEOUTS.NAVIGATION,
    );
  }
  /** Verifies the Work Order Status chart displays expected status labels for the selected year */
  async verifyWorkOrderStatusChartSelectionYearWize(): Promise<void> {
    const workOrderStatusChartSelectionYearWizeConfig =
      homePage.workOrderStatusChartSelectionYearWize;
    const workOrderStatusChartSelectionYearWize =
      await this.web.getElementLocator(
        workOrderStatusChartSelectionYearWizeConfig.locator,
        workOrderStatusChartSelectionYearWizeConfig.locatorType,
      );
    await expect(workOrderStatusChartSelectionYearWize).toBeVisible();
    await workOrderStatusChartSelectionYearWize.click();
    await this.web.pressKey("Escape");

    // Table rows load asynchronously after the dropdown selection; wait for them before reading text
    await this.web.waitForElementVisible(
      `${homePage.workOrderStatusCells} >> nth=0`,
      TIMEOUTS.LONG,
    );
  }
  // Extract status labels from the table cells (first column)
  async verifyWorkOrderStatusTableCellValues(): Promise<void> {
    const actualStatuses = await this.web.getAllTextContentElement(
      homePage.workOrderStatusCells,
    );
    const expectedStatuses = [
      "Draft",
      "InProgress",
      "Submitted",
      "Completed",
      "Incomplete",
    ];

    expect(actualStatuses).toEqual(expectedStatuses);
  }
  /** Validate User listing section Header displays expected elements */
  async verifyHeaderInUserListingSection(): Promise<void> {
    await this.web.waitForElementVisible(
      homePage.usersListingSection,
      TIMEOUTS.NAVIGATION,
    );

    // .forward-arrow-icon matches multiple sections; nth(1) targets the Users Listing section
    const expandButton = await this.web.getNthElement(
      homePage.expandButtonOfUsersListing,
      1,
    );
    await expect(expandButton).toBeVisible();
  }
  /** Validate Work Order Status section arrow icon and table headers display expected elements */
  async verifyArrowForwordIconNavgateToUserListingsScreen(): Promise<void> {
    // arrowForwardIconOfUsersListing is a getByText locator (multiple matches), resolve via getElementLocator + nth
    const arrowIconConfig = homePage.arrowForwardIconOfUsersListing;
    const arrowIcon = await this.web.getElementLocator(
      arrowIconConfig.locator,
      arrowIconConfig.locatorType,
    );
    const arrowIconElement = arrowIcon.nth(arrowIconConfig.nth);
    await expect(arrowIconElement).toBeVisible();
    await arrowIconElement.click();
    // Verify that the Users Listing page heading is visible after navigation
    const userListingPageHeading = await this.web.getElementLocator(
      homePage.userListingPageHeading.locator,
      homePage.userListingPageHeading.locatorType,
      { role: "heading", name: homePage.userListingPageHeading.name },
    );
    await expect(userListingPageHeading).toBeVisible({
      timeout: TIMEOUTS.NAVIGATION,
    });
    await this.web.clickElement(homePage.dashboardButton);
    await this.web.waitForElementVisible(
      homePage.dashboardButton,
      TIMEOUTS.LONG,
    );
  }
  async verifyUserListingTableSectionHeaders(): Promise<void> {
    const roleListingTableHeader = await this.web.getElementLocator(
      homePage.tableRoleTextHeaderListingSection.locator,
      homePage.tableRoleTextHeaderListingSection.locatorType,
    );
    await expect(roleListingTableHeader).toBeVisible();
    const userListingTableHeader = await this.web.getElementLocator(
      homePage.tableUserTextHeaderListingSection.locator,
      homePage.tableUserTextHeaderListingSection.locatorType,
      { exact: homePage.tableUserTextHeaderListingSection.exact },
    );
    await expect(userListingTableHeader).toBeVisible();
  }
  async verifyUserListingTableCellValues(): Promise<void> {
    const userCellConfig = homePage.tableCellValueForUserColumn;
    const userCell = await this.web.getElementLocator(
      userCellConfig.locator,
      userCellConfig.locatorType,
      { role: "cell", name: userCellConfig.name },
    );
    await expect(userCell).toBeVisible();

    const roleCellConfig = homePage.tableCellValueForRoleColumn;
    const roleCell = await this.web.getElementLocator(
      roleCellConfig.locator,
      roleCellConfig.locatorType,
      { role: "cell", name: roleCellConfig.name },
    );
    await expect(roleCell).toBeVisible();
  }
  async verifyLabSetupSectionHeadingTextSection(): Promise<void> {
    const labSetupHeading = this.page
      .locator("h5, h6")
      .filter({ hasText: /^Lab Setup$/i })
      .first();
    await expect(labSetupHeading).toBeVisible({ timeout: TIMEOUTS.NAVIGATION });
  }
  async verifyLabSetupArrowIconNavigateToLabSetupPage(): Promise<void> {
    const labSetupArrowIcon = await this.web.getElementLocator(
      homePage.labSetupArrowIcon.locator,
      homePage.labSetupArrowIcon.locatorType,
    );
    const labSetupArrowIconTarget = labSetupArrowIcon.nth(
      homePage.labSetupArrowIcon.nth,
    );
    await expect(labSetupArrowIconTarget).toBeVisible();
    await labSetupArrowIconTarget.click();
    const labSetupPageHeading = await this.web.getElementLocator(
      homePage.labSetupPageHeading.locator,
      homePage.labSetupPageHeading.locatorType,
      { role: "heading", name: homePage.labSetupPageHeading.name },
    );
    await expect(labSetupPageHeading).toBeVisible({
      timeout: TIMEOUTS.NAVIGATION,
    });
    await this.web.clickElement(homePage.dashboardButton);
    await this.web.waitForElementVisible(
      homePage.dashboardButton,
      TIMEOUTS.LONG,
    );
  }
  async verifyLabSetupTableHeaders(): Promise<void> {
    const plotTypeHeader = await this.web.getElementLocator(
      homePage.labSetupTableHeaderPlotType.locator,
      homePage.labSetupTableHeaderPlotType.locatorType,
    );
    await expect(plotTypeHeader).toBeVisible();

    const sampleTypeHeader = await this.web.getElementLocator(
      homePage.labSetupTableHeaderSampleType.locator,
      homePage.labSetupTableHeaderSampleType.locatorType,
    );
    await expect(sampleTypeHeader).toBeVisible();

    const accountCodeHeader = await this.web.getElementLocator(
      homePage.labSetupTableHeaderAccountCode.locator,
      homePage.labSetupTableHeaderAccountCode.locatorType,
    );
    await expect(accountCodeHeader).toBeVisible();
  }

  async verifyLabSetupTableCellValues(): Promise<void> {
    const growerCellConfig = homePage.labSetupTableCellValue_Grower;
    const growerCell = await this.web.getElementLocator(
      growerCellConfig.locator,
      growerCellConfig.locatorType,
      { role: "cell", name: growerCellConfig.name },
    );
    await expect(growerCell.first()).toBeVisible();

    const tissueCellConfig = homePage.labSetupTableCellValue_Tissue;
    const tissueCell = await this.web.getElementLocator(
      tissueCellConfig.locator,
      tissueCellConfig.locatorType,
      { role: "cell", name: tissueCellConfig.name },
    );
    await expect(tissueCell.first()).toBeVisible();

    const codeNumberCellConfig = homePage.labSetupTableCellValue_codeNumer;
    const codeNumberCell = await this.web.getElementLocator(
      codeNumberCellConfig.locator,
      codeNumberCellConfig.locatorType,
      { role: "cell", name: codeNumberCellConfig.name },
    );
    await expect(codeNumberCell.first()).toBeVisible();
  }
  async verifyRecentlyCreatedWorkOrderTextHeader(): Promise<void> {
    const recentlyCreatedWorkOrdersSectionConfig =
      homePage.recentlyCreatedWorkOrdersSection;
    const recentlyCreatedWorkOrdersSection = await this.web.getElementLocator(
      recentlyCreatedWorkOrdersSectionConfig.locator,
      recentlyCreatedWorkOrdersSectionConfig.locatorType,
      { role: "heading", name: recentlyCreatedWorkOrdersSectionConfig.name },
    );
    await expect(recentlyCreatedWorkOrdersSection).toBeVisible();
  }
  async verifyWorkOrderListingPageNavigationFromRecentWorkOrder(): Promise<void> {
    const recentlyCreatedWoArrowIconConfig =
      homePage.recentlyCreatedWoArrowIcon;
    const recentlyCreatedWoArrowIcon = await this.web.getElementLocator(
      recentlyCreatedWoArrowIconConfig.locator,
      recentlyCreatedWoArrowIconConfig.locatorType,
    );
    const recentlyCreatedWoArrowIconNameTarget = recentlyCreatedWoArrowIcon.nth(
      recentlyCreatedWoArrowIconConfig.nth,
    );
    await expect(recentlyCreatedWoArrowIconNameTarget).toBeVisible();
    await recentlyCreatedWoArrowIconNameTarget.click();
    const workOrderListingPageHeading = await this.web.getElementLocator(
      homePage.workOrderListingPageHeading.locator,
      homePage.workOrderListingPageHeading.locatorType,
      { role: "heading", name: homePage.workOrderListingPageHeading.name },
    );
    await expect(workOrderListingPageHeading).toBeVisible({
      timeout: TIMEOUTS.LONG,
    });
    await this.web.clickElement(homePage.dashboardButton);
    await this.web.waitForElementVisible(
      homePage.dashboardButton,
      TIMEOUTS.NAVIGATION,
    );
  }
  async verifyRecentlyCreatedWorkOrderTableHeaders(): Promise<void> {
    const createdDateHeader = await this.web.getElementLocator(
      homePage.recentlyCreatedWoTableHeader_CreatedDate.locator,
      homePage.recentlyCreatedWoTableHeader_CreatedDate.locatorType,
    );
    await expect(createdDateHeader).toBeVisible();
    const nameHeader = await this.web.getElementLocator(
      homePage.recentlyCreatedWoTableHeader_Name.locator,
      homePage.recentlyCreatedWoTableHeader_Name.locatorType,
    );
    await expect(nameHeader).toBeVisible();

    const dueDateHeader = await this.web.getElementLocator(
      homePage.recentlyCreatedWoTableHeader_DueDate.locator,
      homePage.recentlyCreatedWoTableHeader_DueDate.locatorType,
    );
    await expect(dueDateHeader).toBeVisible();

    const assigneeHeader = await this.web.getElementLocator(
      homePage.recentlyCreatedWoTableHeader_Assignee.locator,
      homePage.recentlyCreatedWoTableHeader_Assignee.locatorType,
    );
    await expect(assigneeHeader).toBeVisible();

    const statusHeader = await this.web.getElementLocator(
      homePage.recentlyCreatedWoTableHeader_Status.locator,
      homePage.recentlyCreatedWoTableHeader_Status.locatorType,
    );
    await expect(statusHeader.first()).toBeVisible();

    const growerHeader = await this.web.getElementLocator(
      homePage.recentlyCreatedWoTableheader_Grower.locator,
      homePage.recentlyCreatedWoTableheader_Grower.locatorType,
      {
        role: "columnheader",
        name: homePage.recentlyCreatedWoTableheader_Grower.name,
      },
    );
    await expect(growerHeader).toBeVisible();
  }
}
