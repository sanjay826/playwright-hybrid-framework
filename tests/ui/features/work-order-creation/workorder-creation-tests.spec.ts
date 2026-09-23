import { test } from "@playwright/test";
import { AuthCommon } from "../../../../commons/ui/auth-common.ts";
import { WorkOrderListingPageSteps } from "../../../../page-object/page-steps/workorderlisting-page-steps.ts";
import { WorkOrderCreationSteps } from "../../../../page-object/page-steps/workorder-creation-step.ts";
import { log } from "../../../../utilities/logger.ts";

let workOrderCreation: WorkOrderCreationSteps;

test.describe(
  "Nutrisolutions Work Order Creation Tests",
  { tag: ["@workordercreation", "@ui"] },
  () => {
    test.beforeEach(async ({ page }) => {
        const authCommon = new AuthCommon(page);
        await authCommon.performLogin();
        const workOrderListing = new WorkOrderListingPageSteps(page);
        await workOrderListing.navigateToWorkOrderListingPage();
        workOrderCreation = new WorkOrderCreationSteps(page);
        await workOrderCreation.openNewWorkOrder();
    });

    for (const sampleType of ["Tissue", "Soil"] as const) {
    test(
        `TC-WO-CREATE-${sampleType.toUpperCase()} | Create and submit a ${sampleType} work order`,
        { tag: [`@TC-WO-CREATE-${sampleType.toUpperCase()}`, "@regression"] },
        async () => {
        log.info(`Running work order creation for ${sampleType}`);
        await test.step(`Create and submit ${sampleType} work order`, async () => {
            await workOrderCreation.createWorkOrder(sampleType);
        });
        },
    );
    }
  }
);
