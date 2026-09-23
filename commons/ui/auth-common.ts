import { Page } from "@playwright/test";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { LoginPageSteps } from "../../page-object/page-steps/login-page-steps.ts";
import { HomePageSteps } from "../../page-object/page-steps/home-page-steps.ts";
import {
  runtimeConfig as config,
  runtimeCredentials,
} from "../../config/config-timouts.ts";

dotenv.config({ override: !process.env.CI });

/**
 * Common Authentication Helper
 *
 * Use this file to perform login once and reuse it across different test pages
 * (Dashboard, Work Order, Reports, etc.)
 *
 * This prevents repetitive login code and makes maintenance easier
 *
 * It also caches the authenticated session (cookies) on disk so that
 * subsequent tests/runs can reuse the same session instead of logging in
 * again. When the cached session is missing/expired/invalid, a fresh login
 * is performed automatically and the cache is refreshed.
 */

// Cache file location and validity window (in ms). Adjust CACHE_TTL_MS as needed.
const CACHE_DIR = path.resolve(process.cwd(), "files");
const CACHE_FILE = path.join(CACHE_DIR, "auth-cache.json");
const CACHE_TTL_MS = 25 * 60 * 1000; // 25 minutes

interface CachedSession {
  storageState: Awaited<
    ReturnType<ReturnType<Page["context"]>["storageState"]>
  >;
  savedAt: number;
}

export class AuthCommon {
  private page: Page;
  private loginPage: LoginPageSteps;
  private homePage: HomePageSteps;

  constructor(page: Page) {
    this.page = page;
    this.loginPage = new LoginPageSteps(page);
    this.homePage = new HomePageSteps(page);
  }

  /**
   * Performs login using a cached session when available/valid, otherwise
   * falls back to a fresh login and re-caches the new session.
   * Call this ONCE in test.beforeEach() for authenticated tests
   *
   * @returns HomePageSteps instance for further interactions
   *
   * @example
   * test.beforeEach(async ({ page }) => {
   *   const authCommon = new AuthCommon(page);
   *   homePage = await authCommon.performLogin();
   * });
   */
  async performLogin(): Promise<HomePageSteps> {
    const cachedSession = this.readCache();

    if (cachedSession && this.isCacheValid(cachedSession)) {
      const restored = await this.tryRestoreSession(cachedSession);
      if (restored) {
        return this.homePage;
      }
    }

    // No valid cache available (missing, expired, or invalid) - login fresh and re-cache
    return this.performFreshLoginAndCache();
  }

  /**
   * Applies cached cookies to the current browser context and verifies
   * the home page loads. Returns false if the cached session turns out
   * to be invalid/expired on the server side.
   */
  private async tryRestoreSession(
    cachedSession: CachedSession,
  ): Promise<boolean> {
    try {
      const { cookies, origins } = cachedSession.storageState;
      await this.page.context().addCookies(cookies);

      // Navigate directly (no title assertion, since an authenticated
      // session may redirect straight to the dashboard instead of login)
      await this.page.goto(config.app.url);
      await this.page.waitForLoadState("load");

      const matchingOrigin = origins.find(
        (o) => o.origin === new URL(config.app.url).origin,
      );
      if (matchingOrigin) {
        await this.page.evaluate((entries) => {
          for (const { name, value } of entries) {
            window.localStorage.setItem(name, value);
          }
        }, matchingOrigin.localStorage);
        await this.page.reload();
      }

      await this.homePage.verifyHomePageIsDisplayed();
      return true;
    } catch {
      // Cached session did not work (server-side expiry, etc.)
      return false;
    }
  }

  /**
   * Performs the real login flow with valid credentials, then stores the
   * resulting session cookies on disk for reuse by later runs.
   */
  private async performFreshLoginAndCache(): Promise<HomePageSteps> {
    const username = runtimeCredentials.username;
    const password = runtimeCredentials.password;
    if (!username || !password) {
      throw new Error("USERNAME and PASSWORD must be set in the .env file");
    }

    // Launch login page
    await this.loginPage.launchLoginPage();

    // Verify login page loaded
    await this.loginPage.verifyLogoIsDisplayed();

    // Enter credentials
    await this.loginPage.enterValidCredentials(username, password);

    // Click login button
    await this.loginPage.clickLoginButton();

    // Verify home page is displayed
    await this.homePage.verifyHomePageIsDisplayed();

    await this.writeCache();

    return this.homePage;
  }

  /**
   * Performs complete login flow with valid credentials
   * Call this ONCE in test.beforeEach() for authenticated tests
   *
   * @returns HomePageSteps instance for further interactions
   *
   * @example
   * test.beforeEach(async ({ page }) => {
   *   const authCommon = new AuthCommon(page);
   *   homePage = await authCommon.performLogin();
   * });
   */
  async performLoginFresh(): Promise<HomePageSteps> {
    return this.performFreshLoginAndCache();
  }

  private readCache(): CachedSession | null {
    try {
      if (!fs.existsSync(CACHE_FILE)) {
        return null;
      }
      const raw = fs.readFileSync(CACHE_FILE, "utf-8");
      return JSON.parse(raw) as CachedSession;
    } catch {
      return null;
    }
  }

  private isCacheValid(cachedSession: CachedSession): boolean {
    return Date.now() - cachedSession.savedAt < CACHE_TTL_MS;
  }

  private async writeCache(): Promise<void> {
    try {
      const storageState = await this.page.context().storageState();
      const cachedSession: CachedSession = {
        storageState,
        savedAt: Date.now(),
      };
      if (!fs.existsSync(CACHE_DIR)) {
        fs.mkdirSync(CACHE_DIR, { recursive: true });
      }
      fs.writeFileSync(
        CACHE_FILE,
        JSON.stringify(cachedSession, null, 2),
        "utf-8",
      );
    } catch {
      // Caching is best-effort; ignore failures so tests are not impacted
    }
  }

  /**
   * Performs login with custom credentials
   * Use this when you need specific test data
   *
   * @param username - User login username
   * @param password - User login password
   * @returns HomePageSteps instance
   */
  /* async performLoginWithCustomCredentials(
    username: string,
    password: string,
  ): Promise<HomePageSteps> {
    await this.loginPage.launchLoginPage();
    await this.loginPage.verifyLogoIsDisplayed();
    await this.loginPage.enterValidCredentials(username, password);
    await this.loginPage.clickLoginButton();
    await this.homePage.verifyHomePageIsDisplayed();
    return this.homePage;
  } */

  /**
   * Performs logout
   * Call this in test.afterEach() for cleanup
   */
  async performLogout(): Promise<void> {
    await this.homePage.verifyLogoutLinkIsDisplayedWithIcon();
  }

  /**
   * Returns initialized LoginPageSteps
   */
  getLoginPageSteps(): LoginPageSteps {
    return this.loginPage;
  }

  /**
   * Returns initialized HomePageSteps
   */
  getHomePageSteps(): HomePageSteps {
    return this.homePage;
  }
}
