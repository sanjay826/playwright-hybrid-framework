import { test } from "@playwright/test";
import { ApiCommons } from "../../commons/api/api-commons.ts";
import testdata from "../../testdata/api/data.json" with { type: "json" };
import { log } from "../../utilities/logger.ts";

test.describe("user retrieval related APIs", { tag: ["@userAPIs"] }, () => {
  let api: ApiCommons;

  // Initialize the API commons method and request a context before each test case
  test.beforeEach(async () => {
    api = new ApiCommons();
    await api.InitializeRequestContext();
  });
  // Test case 1 :  Get the all user details
  test(
    "TC-API-USER-01 | Get All User Details",
    { tag: ["@TC-API-USER-01"] },
    async () => {
      log.info("Running TC-API-USER-01 | Get All User Details");
      const data = testdata.allUsers;
      await api.getResponse(data.requestType, data.endpoint);
      await api.validateStatusCode(data.expectedStatusCode);
      await api.validateStatusMessage(data.expectedMessage);
    },
  );

  // Test case 2 :  Validate  Active User
  test(
    "TC-API-USER-02 | Validate Active User",
    { tag: ["@TC-API-USER-02"] },
    async () => {
      log.info("Running TC-API-USER-02 | Validate Active User");
      const data = testdata.activeUsers;
      await api.getResponse(data.requestType, data.endpoint);
      await api.validateStatusCode(data.expectedStatusCode);
      await api.validateStatusMessage(data.expectedMessage);
      await api.validateResponseBody("UserId", data.userId);
      await api.validateResponseBody("FirstName", data.firstName);
      await api.validateResponseSchema("LastName", data.expDataType);
    },
  );

  // Test case 3 : Retrieve all user retailer details
  test(
    "TC-API-USER-03 | Retrieve All User Retailer Details",
    { tag: ["@TC-API-USER-03"] },
    async () => {
      log.info("Running TC-API-USER-03 | Retrieve All User Retailer Details");
      const data = testdata.allUserRetailers;
      await api.getResponse(data.requestType, data.endpoint);
      await api.validateStatusCode(data.expectedStatusCode);
      await api.validateStatusMessage(data.expectedMessage);
      await api.validateResponseBody("RetailerId", data.userRetailerId);
      await api.validateResponseSchema("PlotTypeName", data.expDataType);
    },
  );

  // Test case 4 : Retrieve user count
  test(
    "TC-API-USER-04 | Retrieve User Count",
    { tag: ["@TC-API-USER-04"] },
    async () => {
      log.info("Running TC-API-USER-04 | Retrieve User Count");
      const data = testdata.userCount;
      await api.getResponse(data.requestType, data.endpoint);
      await api.validateStatusCode(data.expectedStatusCode);
      await api.validateStatusMessage(data.expectedMessage);
      await api.validateResponseBody(
        "UserRetailerABNumber",
        data.userRetailerABNumber,
      );
      await api.validateResponseBody("UserRoleName", data.userRoleName);
      await api.validateResponseSchema("UserRoleName", data.expDataType);
    },
  );
});
