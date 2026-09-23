import { Page, Locator, expect } from "@playwright/test";
import { WebCommons } from "../../commons/ui/web-commons.ts";
import loginPage from "../page-elements/login-page-elements.json" with { type: "json" };
import { runtimeConfig as config } from "../../config/config-timouts.ts";
import { TIMEOUTS } from "../../config/config-timouts.ts";

export class LoginPageSteps {
  page: Page;
  web: WebCommons;

  constructor(page: Page) {
    this.page = page;
    this.web = new WebCommons(page);
  }

  //Method to Launch the Application
  async launchLoginPage(): Promise<void> {
    await this.web.launchApplication(config.app.url, config.app.title);
  }
  //Method to Verify login page is displayed.
  async verifyLogoIsDisplayed(): Promise<void> {
    await this.web.waitForElementVisible(loginPage.logo, TIMEOUTS.EXTENDED);
  }

  // Method to enter valid username and password
  async enterValidCredentials(
    username: string,
    password: string,
  ): Promise<void> {
    await this.web.clearText(loginPage.username);
    await this.web.typeText(loginPage.username, username);
    await this.web.clearText(loginPage.password);
    await this.web.typeText(loginPage.password, password);
  }

  // Method to enter invalid username and password
  async enterInvalidCredentials(
    username: string,
    password: string,
  ): Promise<void> {
    await this.web.clearText(loginPage.username);
    await this.web.typeText(loginPage.username, username);
    await this.web.clearText(loginPage.password);
    await this.web.typeText(loginPage.password, password);
  }

  //Method to click on login button
  async clickLoginButton(): Promise<void> {
    await this.web.clickElement(loginPage.loginButton);
  }
  // method to verify forgot Username link is displayed and clickable
  async verifyForgotUsernameLinkIsDisplayedAndNavigatedPage(): Promise<void> {
    await this.web.verifyElementVisibility(loginPage.forgotUsernameLink, true);
    await this.web.clickElement(loginPage.forgotUsernameLink);
    await this.web.verifyElementVisibility(loginPage.forgotUsernamePage, true);
  }
  // Method to verify forgot password link is displayed and clickable
  async verifyForgotPasswordLinkIsDisplayedAndNavigatedPage(): Promise<void> {
    await this.web.verifyElementVisibility(loginPage.forgotPasswordLink, true);
    await this.web.clickElement(loginPage.forgotPasswordLink);
    await this.web.verifyElementVisibility(loginPage.forgotPasswordPage, true);
  }

  // Method 2: Verify login error message is displayed and optionally compare with expected message from testData/spec
  async verifyLoginErrorMessageIsDisplayed(
    expectedMessage: string,
  ): Promise<void> {
    await this.web.verifyElementVisibility(loginPage.loginErrorMessage, true);
    await this.web.waitForPageLoad();
    const actualErrorMessage = (
      (await this.web.getElementText(loginPage.loginErrorMessage)) || ""
    )
      .replace(/\s+/g, " ")
      .trim();
    expect(actualErrorMessage).toContain(
      expectedMessage.replace(/\s+/g, " ").trim(),
    );
  }

  // Method to verify create account link is displayed and clickable
  async verifyCreateAccountLinkIsDisplayed(): Promise<void> {
    await this.web.verifyElementVisibility(loginPage.createAccountLink, true);
    await this.web.clickElement(loginPage.createAccountLink);
    await this.web.verifyElementVisibility(loginPage.registrationPage, true);
  }
  // Method to verify help link text.
  async verifyHelpLinkIsDisplayed(expectedHelpLinkText: string): Promise<void> {
    await this.web.verifyElementVisibility(loginPage.helpLinkText, true);
    const actualHelpLinkText =
      (await this.web.getElementInnerText(loginPage.helpLinkText)) || "";
    expect(actualHelpLinkText.trim()).toContain(expectedHelpLinkText.trim());
  }
}
