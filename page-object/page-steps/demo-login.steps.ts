import { Page } from "@playwright/test";
import { WebCommons } from "../../commons/ui/web-commons.ts";
import loginPage from "../page-elements/demo-page-elemenets.json" with { type: "json" };
import config from "../../config/config.json" with { type: "json" };

const loginPath = "practice-test-login/";


export class DemoLoginSteps {
page: Page;
 web: WebCommons;

  constructor(page: Page) {
    this.page = page;
    this.web = new WebCommons(page);
  }
  async launchLoginPage() {
    const loginUrl = new URL(loginPath, config.demoLoginBase_URL).toString();
    await this.web.launchApplication(loginUrl);
  }

  async login(username: string, password: string) {
    await this.web.typeText(loginPage.username, username);
    await this.web.typeText(loginPage.passwordInput, password);
    await this.web.clickElement(loginPage.loginButton);
  }
}