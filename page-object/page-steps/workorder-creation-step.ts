import { expect, Page } from "@playwright/test";
import { WebCommons } from "../../commons/ui/web-commons.ts";
import workOrderListingPage from "../page-elements/workorderlisting-page-element.json" with { type: "json" };
import workOrderCreationPage from "../page-elements/workorder-creation-element.json" with { type: "json" };
import { runtimeCredentials } from "../../config/config-timouts.ts";
import { TIMEOUTS } from "../../config/config-timouts.ts";
import { log } from "../../utilities/logger.ts";

export type WorkOrderSampleType = "Tissue" | "Soil";

export class WorkOrderCreationSteps {
  page: Page;
  web: WebCommons;

  constructor(page: Page) {
    this.page = page;
    this.web = new WebCommons(page);
  }

  async openNewWorkOrder(): Promise<void> {
    const addWorkOrderButton = await this.web.getElementLocator(
      workOrderListingPage.addNewWorkOrderButton.locator,
      workOrderListingPage.addNewWorkOrderButton.locatorType,
      { role: "button", name: "Add Work Order" },
    );
    await this.web.clickElement(addWorkOrderButton);

    const heading = await this.web.getElementLocator(
      workOrderCreationPage.newWorkOrderHeading.locator,
      workOrderCreationPage.newWorkOrderHeading.locatorType,
      {
        role: workOrderCreationPage.newWorkOrderHeading.role,
        name: workOrderCreationPage.newWorkOrderHeading.name,
      },
    );
    await expect(heading).toBeVisible({ timeout: TIMEOUTS.LONG });
  }

  async createWorkOrder(sampleType: WorkOrderSampleType): Promise<void> {
    const workOrderName = `Web_WO-${Date.now()}`;
    const nextDay = new Date();
    nextDay.setDate(nextDay.getDate() + 1);
    const nextDayText = `${String(nextDay.getMonth() + 1).padStart(2, "0")}/${String(nextDay.getDate()).padStart(2, "0")}/${nextDay.getFullYear()}`;

    const workOrderNameInput = await this.web.getElementLocator(
      workOrderCreationPage.workOrderNameInput.locator,
      workOrderCreationPage.workOrderNameInput.locatorType,
    );
    await workOrderNameInput.fill(workOrderName);
    const dateInput = await this.web.getElementLocator(
      workOrderCreationPage.dateInput.locator,
      workOrderCreationPage.dateInput.locatorType,
    );
    await expect(dateInput).toBeVisible();
    await this.web.waitForElementHidden(
      workOrderCreationPage.loaderOverlay,
      TIMEOUTS.LONG,
    );
    const openCalendarButton = await this.web.getElementLocator(
      workOrderCreationPage.openCalendarButton.locator,
      workOrderCreationPage.openCalendarButton.locatorType,
      {
        role: workOrderCreationPage.openCalendarButton.role,
        name: workOrderCreationPage.openCalendarButton.name,
      },
    );
    await this.web.clickElement(openCalendarButton);
    const nextDayLabel = nextDay.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
    const nextDayCell = await this.web.getElementLocator(
      nextDayLabel,
      "getByRole",
      { role: "gridcell", name: nextDayLabel },
    );
    await this.web.clickElement(nextDayCell);
    await expect(dateInput).not.toHaveValue("");
    const nextButton = await this.web.getElementLocator(
      workOrderCreationPage.nextButton.locator,
      workOrderCreationPage.nextButton.locatorType,
      {
        role: workOrderCreationPage.nextButton.role,
        name: workOrderCreationPage.nextButton.name,
        exact: true,
      },
    );
    await this.web.clickElement(nextButton);

    const growerInput = await this.web.getElementLocator(
      workOrderCreationPage.growerDropdown.locator,
      workOrderCreationPage.growerDropdown.locatorType,
    );
    await growerInput.click();
    const growerDialog = await this.web.getElementLocator(
      workOrderCreationPage.growerSearchDialog.locator,
      workOrderCreationPage.growerSearchDialog.locatorType,
      {
        role: workOrderCreationPage.growerSearchDialog.role,
        name: workOrderCreationPage.growerSearchDialog.name,
      },
    );
    await expect(growerDialog).toBeVisible({ timeout: TIMEOUTS.LONG });
    const growerRows = this.web.getChildRoleLocator(growerDialog, "row");
    await this.web.clickNthElement(growerRows, 1);
    await this.web.waitForElementHidden(
      workOrderCreationPage.loaderOverlay,
      TIMEOUTS.LONG,
    );
    const farmNameInput = await this.web.getElementLocator(
      workOrderCreationPage.farmNameInput.locator,
      workOrderCreationPage.farmNameInput.locatorType,
    );
    await farmNameInput.fill("Test-Automation");
    const fieldNameInput = await this.web.getElementLocator(
      workOrderCreationPage.fieldNameInput.locator,
      workOrderCreationPage.fieldNameInput.locatorType,
    );
    await fieldNameInput.fill("Test Field");
    await this.web.clickElement(nextButton);

    const sampleTypeRadio =
      sampleType === "Tissue"
        ? workOrderCreationPage.tissueSampleTypeRadio
        : workOrderCreationPage.sampleTypeDropdown;
    const sampleRadio = await this.web.getElementLocator(
      sampleTypeRadio.locator,
      sampleTypeRadio.locatorType,
      {
        role: sampleTypeRadio.role,
        name: sampleTypeRadio.name,
        exact: true,
      },
    );
    await sampleRadio.check();
    if (sampleType === "Tissue") {
      const cropDropdown = await this.web.getElementLocator(
        workOrderCreationPage.cropDropdown.locator,
        workOrderCreationPage.cropDropdown.locatorType,
        {
          role: workOrderCreationPage.cropDropdown.role,
          name: workOrderCreationPage.cropDropdown.name,
        },
      );
      await this.web.clickElement(cropDropdown);
      const cornOption = await this.web.getElementLocator("CORN", "getByRole", {
        role: "option",
        name: "CORN",
        exact: true,
      });
      await this.web.clickElement(cornOption);
      const growthStage = await this.web.getElementLocator(
        workOrderCreationPage.growthStageDropdown.locator,
        workOrderCreationPage.growthStageDropdown.locatorType,
      );
      await this.web.clickElement(growthStage);
      const options = await this.web.getElementLocator(
        workOrderCreationPage.growthStageInput,
        "css"
      );
        await this.web.clickElement(options);
    }   else {
        const sampleDepth = await this.web.getElementLocator(
        workOrderCreationPage.sampleDepthDropdown.locator,
        workOrderCreationPage.sampleDepthDropdown.locatorType,
        {
          role: workOrderCreationPage.sampleDepthDropdown.role,
          name: workOrderCreationPage.sampleDepthDropdown.name,
        },
      );
      await this.web.clickElement(sampleDepth);
      const options = await this.web.getElementLocator("option", "getByRole", {
        role: "option",
      });
      await this.web.clickNthElement(options, 0);
    }
    const plotType = await this.web.getElementLocator(
      workOrderCreationPage.plotTypeDropdown.locator,
      workOrderCreationPage.plotTypeDropdown.locatorType,
      {
        role: workOrderCreationPage.plotTypeDropdown.role,
        name: workOrderCreationPage.plotTypeDropdown.name,
      },
    );
    await this.web.clickElement(plotType);
    await plotType.press("ArrowDown");
    await plotType.press("Enter");
    await this.web.waitForElementHidden(
      workOrderCreationPage.loaderOverlay,
      TIMEOUTS.LONG,
    );
    const labName = await this.web.getElementLocator(
      workOrderCreationPage.labDropdown.locator,
      workOrderCreationPage.labDropdown.locatorType,
      {
        role: workOrderCreationPage.labDropdown.role,
        name: workOrderCreationPage.labDropdown.name,
      },
    );
    await this.web.clickElement(labName);
    await labName.press("ArrowDown");
    await labName.press("Enter");
    const labLocation = await this.web.getElementLocator(
      workOrderCreationPage.labLocationDropdown.locator,
      workOrderCreationPage.labLocationDropdown.locatorType,
      {
        role: workOrderCreationPage.labLocationDropdown.role,
        name: workOrderCreationPage.labLocationDropdown.name,
      },
    );
    await this.web.clickElement(labLocation);
    const options = await this.web.getElementLocator("option", "getByRole", {
      role: "option",
    });
    await this.web.clickNthElement(options, 0);
    const testPackage = await this.web.getElementLocator(
      workOrderCreationPage.testPackageRadio,
      "getByRole",
      { role: "radio", name: workOrderCreationPage.testPackageRadio },
    );
    await testPackage.check();
    await nextButton.click();
    await this.web.waitForElementHidden(
      workOrderCreationPage.loaderOverlay,
      TIMEOUTS.LONG,
    );
    await this.page
      .locator('[role="tabpanel"]:visible')
      .getByRole("button", {
        name: workOrderCreationPage.nextButton.name,
        exact: true,
      })
      .click();
    await this.web.waitForElementHidden(
      workOrderCreationPage.loaderOverlay,
      TIMEOUTS.LONG,
    );

    const unitedStates = this.page.getByText("United States", { exact: true });
    if (await unitedStates.count()) {
      await unitedStates.first().click();
    } else {
      const mapRegion = await this.web.getElementLocator(
        workOrderCreationPage.mapRegion.locator,
        workOrderCreationPage.mapRegion.locatorType,
        {
          role: workOrderCreationPage.mapRegion.role,
          name: workOrderCreationPage.mapRegion.name,
        },
      );
      if (await mapRegion.count()) {
        await this.page
          .locator(".gm-style")
          .last()
          .click({ force: true, position: { x: 500, y: 100 } });
      } else {
        await this.page
          .locator("svg")
          .last()
          .click({ force: true, position: { x: 300, y: 200 } });
      }
    }
    const sampleDialog = await this.web.getElementLocator(
      workOrderCreationPage.growerSearchDialog.locator,
      workOrderCreationPage.growerSearchDialog.locatorType,
      {
        role: workOrderCreationPage.growerSearchDialog.role,
        name: workOrderCreationPage.growerSearchDialog.name,
      },
    );
    await expect(sampleDialog).toBeVisible({ timeout: TIMEOUTS.LONG });
    const sampleNameInput = await this.web.getElementLocator(
      workOrderCreationPage.sampleNameInput.locator,
      workOrderCreationPage.sampleNameInput.locatorType,
      {
        role: workOrderCreationPage.sampleNameInput.role,
        name: workOrderCreationPage.sampleNameInput.name,
      },
    );
    await sampleNameInput.fill("Sample 1");
    const sampleDoneButton = await this.web.getElementLocator(
      workOrderCreationPage.sampleDialogDoneButton.locator,
      workOrderCreationPage.sampleDialogDoneButton.locatorType,
      {
        role: workOrderCreationPage.sampleDialogDoneButton.role,
        name: workOrderCreationPage.sampleDialogDoneButton.name,
      },
    );
    await this.web.clickElement(sampleDoneButton);

    const addSampleButton = await this.web.getElementLocator(
      workOrderCreationPage.addSampleButton.locator,
      workOrderCreationPage.addSampleButton.locatorType,
      {
        role: workOrderCreationPage.addSampleButton.role,
        name: workOrderCreationPage.addSampleButton.name,
      },
    );
    await expect(addSampleButton).toBeVisible({ timeout: TIMEOUTS.LONG });
    await addSampleButton.click();
    await sampleNameInput.fill("Sample 2");
    await this.web.clickElement(sampleDoneButton);
    await this.web.clickElement(nextButton);

    const assignee = await this.web.getElementLocator(
      workOrderCreationPage.assigneeDropdown.locator,
      workOrderCreationPage.assigneeDropdown.locatorType,
      {
        role: workOrderCreationPage.assigneeDropdown.role,
        name: workOrderCreationPage.assigneeDropdown.name,
      },
    );
    await assignee.click();
    const username = runtimeCredentials.username;
    if (!username) {
      throw new Error(
        "USERNAME must be set in the environment for Assignee selection",
      );
    }
    const assigneeOption = await this.web.getElementLocator(
      username,
      "getByRole",
      { role: "option", name: username },
    );
    await assigneeOption.click();
    await this.web.clickElement(nextButton);

    const createToast = this.page.locator(
      workOrderCreationPage.createSuccessToast,
    );
    await expect(createToast).toBeVisible({ timeout: TIMEOUTS.LONG });
    log.info("Work order created successfully", {
      workOrderName,
      sampleType,
      nextDay: nextDayText,
      toastMessage: (await createToast.innerText()).trim(),
    });

    const submitButton = await this.web.getElementLocator(
      workOrderCreationPage.submitButton.locator,
      workOrderCreationPage.submitButton.locatorType,
      {
        role: workOrderCreationPage.submitButton.role,
        name: workOrderCreationPage.submitButton.name,
      },
    );
    await this.web.clickElement(submitButton);
    const confirmationToast = this.page.locator(
      workOrderCreationPage.confirmationToast,
    );
    await expect(confirmationToast).toBeVisible({ timeout: TIMEOUTS.LONG });
    log.info("Work order submitted successfully", {
      workOrderName,
      toastMessage: (await confirmationToast.innerText()).trim(),
    });
    const okButton = await this.web.getElementLocator(
      workOrderCreationPage.okButton.locator,
      workOrderCreationPage.okButton.locatorType,
      {
        role: workOrderCreationPage.okButton.role,
        name: workOrderCreationPage.okButton.name,
      },
    );
    await this.web.clickElement(okButton);
  }
}
