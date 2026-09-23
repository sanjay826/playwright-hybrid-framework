import { test } from "@playwright/test";
import { faker } from "@faker-js/faker";
import { LoginPageSteps } from "../../../../page-object/page-steps/login-page-steps.ts";
import data from "../../../../testdata/ui/data.json" with { type: "json" };
import { HomePageSteps } from "../../../../page-object/page-steps/home-page-steps.ts";
import dotenv from "dotenv";
import { runtimeCredentials } from "../../../../config/config-timouts.ts";
import { log } from "../../../../utilities/logger.ts";

dotenv.config({ override: !process.env.CI });

let loginPage: LoginPageSteps;
let homePage: HomePageSteps;

test.describe("Nutrisolutions Login Tests", { tag: ["@login", "@ui"] }, () => {
  //initialize page objects before each test
  test.beforeEach(async ({ page }) => {
    await test.step("Launch application and verify login page", async () => {
      log.info("Launching application and verifying login page");
      loginPage = new LoginPageSteps(page);
      homePage = new HomePageSteps(page);
      await loginPage.launchLoginPage();
      await loginPage.verifyLogoIsDisplayed();
    });
  });
  /** Test case -1 : verify login functionality with valid credentials */
  test(
    "TC-LOGIN-01 | Verify login functionality with valid credentials",
    { tag: ["@TC-LOGIN-01", "@smoke", "@critical"] },
    async () => {
      log.info(
        "Running TC-LOGIN-01 | Verify login functionality with valid credentials",
      );
      const username = runtimeCredentials.username;
      const password = runtimeCredentials.password;
      if (!username || !password) {
        throw new Error("USERNAME and PASSWORD must be set in the .env file");
      }
      await test.step("Enter valid credentials and login", async () => {
        await loginPage.enterValidCredentials(username, password);
        await loginPage.clickLoginButton();
      });
      await test.step("Verify home page is displayed", async () => {
        await homePage.verifyHomePageIsDisplayed();
      });
    },
  );

  /** Test case -2 : verify login functionality with invalid credentials */
  let testData = data["Verify login functionality with invalid credentials"];
  Array.from({ length: 2 }, (_, index) => index).forEach((index) => {
    test(
      `TC-LOGIN-02.${index + 1} | Verify login functionality with invalid credentials`,
      { tag: [`@TC-LOGIN-02.${index + 1}`, "@regression"] },
      async () => {
        log.info(
          `Running TC-LOGIN-02.${index + 1} | Verify login functionality with invalid credentials`,
        );
        const credentials = {
          username: faker.internet.username(),
          password: faker.internet.password({ length: 16 }),
        };
        await test.step(`Enter invalid credentials (${credentials.username}) and login`, async () => {
          await loginPage.enterInvalidCredentials(
            credentials.username,
            credentials.password,
          );
          await loginPage.clickLoginButton();
        });
        await test.step("Verify login error message is displayed", async () => {
          await loginPage.verifyLoginErrorMessageIsDisplayed(
            testData.errorMessageForInvalidCredentials,
          );
        });
      },
    );
  });
  /** Test Case -3 : Verify the Forgot Username link . */
  test(
    "TC-LOGIN-03 | Verify forgot username link",
    { tag: ["@TC-LOGIN-03", "@regression"] },
    async () => {
      log.info("Running TC-LOGIN-03 | Verify forgot username link");
      await test.step("Verify forgot username link navigates correctly", async () => {
        await loginPage.verifyForgotUsernameLinkIsDisplayedAndNavigatedPage();
      });
    },
  );
  /** Test Case -4 : Verify the Forgot Password link . */
  test(
    "TC-LOGIN-04 | Verify forgot password link",
    { tag: ["@TC-LOGIN-04", "@regression"] },
    async () => {
      log.info("Running TC-LOGIN-04 | Verify forgot password link");
      await test.step("Verify forgot password link navigates correctly", async () => {
        await loginPage.verifyForgotPasswordLinkIsDisplayedAndNavigatedPage();
      });
    },
  );
  /** Test case -5 : verify create account Link */
  test(
    "TC-LOGIN-05 | Verify create account link",
    { tag: ["@TC-LOGIN-05", "@regression"] },
    async () => {
      log.info("Running TC-LOGIN-05 | Verify create account link");
      await test.step("Verify create account link navigates correctly", async () => {
        await loginPage.verifyCreateAccountLinkIsDisplayed();
      });
    },
  );
  /**Test case -6 : verify help link text */
  test(
    "TC-LOGIN-06 | Verify help link text",
    { tag: ["@TC-LOGIN-06", "@regression"] },
    async () => {
      log.info("Running TC-LOGIN-06 | Verify help link text");
      let helpLinkText = data["Verify help link text"].expectedHelpLinkText;
      await test.step("Verify help link text is correct", async () => {
        await loginPage.verifyHelpLinkIsDisplayed(helpLinkText);
      });
    },
  );
});
