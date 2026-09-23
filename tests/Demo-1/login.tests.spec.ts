
import { test } from "@playwright/test";
import credentials from "../../config/demo-login-credentials.json" with { type: "json" };
import { DemoLoginSteps } from "../../page-object/page-steps/demo-login.steps.ts";

Object.entries(credentials).forEach(([credentialSet, credentialList]) => {
  credentialList.forEach((loginCredentials, index) => {
    test(
      `@TC-Demo.${credentialSet} | Verify login functionality`,
      async ({ page }) => {
        const loginSteps = new DemoLoginSteps(page);

        await loginSteps.launchLoginPage();
        await loginSteps.login(
          loginCredentials.username,
          loginCredentials.password,
        );
      },
    );
  });
});