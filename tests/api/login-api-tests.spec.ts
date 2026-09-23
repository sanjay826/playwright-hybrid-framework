import { test } from "@playwright/test";
import { ApiCommons } from "../../commons/api/api-commons.ts";
import testdata from "../../testdata/api/data.json" with { type: "json" };
import { log } from "../../utilities/logger.ts";

test.describe("login related APIs", { tag: ["@loginAPIs"] }, () => {
  let api: ApiCommons;

  // Initialize the API commons method and request a context before each test case
  test.beforeEach(async () => {
    api = new ApiCommons();
    await api.InitializeRequestContext();
  });

  // Test case :  Get login details
  test(
    "TC-API-LOGIN-01 | Get Login Details",
    { tag: ["@TC-API-LOGIN-01"] },
    async () => {
      log.info("Running TC-API-LOGIN-01 | Get Login Details");
      const data = testdata.loginDetails;
      await api.getResponse(data.requestType, data.endpoint);
      await api.validateStatusCode(data.expectedStatusCode);
      await api.validateStatusMessage(data.expectedMessage);
      await api.validateResponseBody("UserRetailerName", data.userRetailerName);
      await api.validateResponseBody("UserId", data.userId);
      await api.validateResponseSchema("UserRetailerName", data.expDataType);
    },
  );
});
