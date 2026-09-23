import { expect, Page } from "@playwright/test";
import { WebCommons } from "../../commons/ui/web-commons.ts";
import homePage from "../page-elements/home-page-elements.json" with { type: "json" };
import labSetupPage from "../page-elements/lab-setup-element.json" with { type: "json" };
import { TIMEOUTS } from "../../config/config-timouts.ts";
import { log } from "../../utilities/logger.ts";

export class LabSetupSteps {
  page: Page;
  web: WebCommons;

  constructor(page: Page) {
    this.page = page;
    this.web = new WebCommons(page);
  }

  /** Navigate to the Lab Setup page. */
  async navigateToLabSetupPage(): Promise<void> {
    const labSetupArrowIcon = await this.web.getElementLocator(
      homePage.labSetupArrowIcon.locator,
      homePage.labSetupArrowIcon.locatorType,
    );
    await labSetupArrowIcon.nth(homePage.labSetupArrowIcon.nth).click();

    const pageHeading = await this.web.getElementLocator(
      labSetupPage.labSetupPageHeading.locator,
      labSetupPage.labSetupPageHeading.locatorType,
      {
        role: labSetupPage.labSetupPageHeading.role,
        name: labSetupPage.labSetupPageHeading.name,
      },
    );
    await expect(pageHeading).toBeVisible({ timeout: TIMEOUTS.LONG });
  }

  /** Verify the Lab Setup page controls, table headers, and data. */
  async verifyLabSetupPageElements(): Promise<void> {
    const pageHeading = await this.web.getElementLocator(
      labSetupPage.labSetupPageHeading.locator,
      labSetupPage.labSetupPageHeading.locatorType,
      {
        role: labSetupPage.labSetupPageHeading.role,
        name: labSetupPage.labSetupPageHeading.name,
      },
    );
    await expect(pageHeading).toBeVisible();

    await this.web.verifyElementVisibility(labSetupPage.labSetupTable, true);

    for (const header of [
      labSetupPage.plotTypeHeader,
      labSetupPage.sampleTypeHeader,
      labSetupPage.accountCodeHeader,
    ]) {
      const headerElement = await this.web.getElementLocator(
        header.locator,
        header.locatorType,
      );
      await expect(headerElement).toBeVisible();
    }

    for (const cell of [
      labSetupPage.growerCell,
      labSetupPage.tissueCell,
      labSetupPage.accountCodeCell,
    ]) {
      const cellElement = await this.web.getElementLocator(
        cell.locator,
        cell.locatorType,
        { role: cell.role, name: cell.name },
      );
      await expect(cellElement.first()).toBeVisible();
    }

    const tableRows = this.page.locator(labSetupPage.labSetupTableRows);
    await expect(tableRows.first()).toBeVisible({ timeout: TIMEOUTS.LONG });
    expect(await tableRows.count()).toBeGreaterThan(0);
  }

  /** Add a Lab Setup record and verify the saved values in the table. */
  async addNewLabSetup(): Promise<void> {
    const accountCode = Date.now().toString().slice(-8);

    await this.web.clickElement(
      await this.web.getElementLocator(
        labSetupPage.addLabButton.locator,
        labSetupPage.addLabButton.locatorType,
        {
          role: labSetupPage.addLabButton.role,
          name: labSetupPage.addLabButton.name,
        },
      ),
    );
    const newLabRow = this.page.locator(labSetupPage.newLabRow);
    await expect(newLabRow).toBeVisible({ timeout: TIMEOUTS.LONG });

    const dropdowns = newLabRow.getByRole("combobox");
    await dropdowns.nth(0).click();
    await this.page
      .getByRole("option", { name: "Grower", exact: true })
      .click();
    await dropdowns.nth(1).click();
    await this.page.getByRole("option", { name: "Soil", exact: true }).click();

    const inputs = newLabRow.getByRole("textbox");
    await inputs.nth(0).fill("Test-Noida");
    await inputs.nth(1).fill(accountCode);
    await this.web.clickElement(
      await this.web.getElementLocator(
        labSetupPage.saveLabButton.locator,
        labSetupPage.saveLabButton.locatorType,
        {
          role: labSetupPage.saveLabButton.role,
          name: labSetupPage.saveLabButton.name,
        },
      ),
    );

    const toast = this.page.locator(labSetupPage.saveSuccessToast);
    await expect(toast).toBeVisible({ timeout: TIMEOUTS.LONG });
    const toastMessage = (await toast.innerText()).trim();
    expect(toastMessage).not.toBe("");
    log.info("Lab Setup saved successfully", { toastMessage });

    await expect(inputs.nth(0)).toHaveValue("Test-Noida");
    await expect(inputs.nth(1)).toHaveValue(accountCode);
    await expect(dropdowns.nth(0)).toHaveText("Grower");
    await expect(dropdowns.nth(1)).toHaveText("Soil");
  }
}
