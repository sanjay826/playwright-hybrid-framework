import { test } from "@playwright/test";
import { ApiCommons } from "../../commons/api/api-commons.ts";
import testdata from "../../testdata/api/data.json" with { type: "json" };
import { log } from "../../utilities/logger.ts";

test.describe("Work order related APIs", { tag: ["@workorderAPIs"] }, () => {
  let api: ApiCommons;

  // Initialize the API commons method and request a context before each test case
  test.beforeEach(async () => {
    api = new ApiCommons();
    await api.InitializeRequestContext();
  });

  // Test case :  1 - Retrieve specific workorders
  test(
    "TC-API-WO-01 | Retrieve specific workorders",
    { tag: ["@TC-API-WO-01"] },
    async () => {
      log.info("Running TC-API-WO-01 | Retrieve specific workorders");
      const data = testdata.retrievespecificworkorders;
      await api.getResponse(data.requestType, data.endpoint);
      await api.validateStatusCode(data.expectedStatusCode);
      await api.validateStatusMessage(data.expectedMessage);
      await api.validateResponseBody("Id", data.id);
      await api.validateResponseBody("Grower_Id", data.Grower_Id);
      await api.validateResponseBody("RetailerId", data.RetailerId);
      await api.validateResponseSchema("RetailerName", data.expDataType);
    },
  );

  // Test case :  2 - Retrieve Specific RecentWorkorders
  test(
    "TC-API-WO-02 | Retrieve Specific RecentWorkorders",
    { tag: ["@TC-API-WO-02"] },
    async () => {
      log.info("Running TC-API-WO-02 | Retrieve Specific RecentWorkorders");
      const data = testdata.RecentWorkorders;
      await api.getResponse(data.requestType, data.endpoint);
      await api.validateStatusCode(data.expectedStatusCode);
      await api.validateStatusMessage(data.expectedMessage);
      await api.validateResponseBody("IsPaperProcess", data.IsPaperProcess);
      await api.validateResponseBody("GrowerName", data.GrowerName);
      await api.validateResponseSchema("GrowerName", data.expDataType);
    },
  );

  // Test case :  3 -Retrieve workorder Count
  test(
    "TC-API-WO-03 | Retrieve workorder Count",
    { tag: ["@TC-API-WO-03"] },
    async () => {
      log.info("Running TC-API-WO-03 | Retrieve workorder Count");
      const data = testdata.userCount;
      await api.getResponse(data.requestType, data.endpoint);
      await api.validateStatusCode(data.expectedStatusCode);
      await api.validateStatusMessage(data.expectedMessage);
      await api.validateResponseSchema(
        "UserRetailerABNumber",
        data.expDataType,
      );
      await api.validateResponseBody("UserRoleName", data.userRoleName);
    },
  );
});
