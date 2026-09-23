import { Page, Locator, expect } from "@playwright/test";
import { log as logger } from "../../utilities/logger.ts";

export type flex = string | Locator;

export class WebCommons {
  readonly page: Page;
  readonly log = logger;

  constructor(page: Page) {
    this.page = page;
  }

  describe(target: flex): string {
    return typeof target === "string" ? target : target.toString();
  }

  //Common method  to generate WebElements from the differnt types of locators(getByText, getByRole, getByLabel, getByPlaceholder, getByAltText, getByTitle
  //example usage:
  // const element = await getElementLocator("Submit", "getByRole", "button");
  async getElementLocator(
    locator: string,
    locatorType: string,
    options?: { role?: string; exact?: boolean; name?: string },
  ): Promise<Locator> {
    switch (locatorType) {
      case "getByText":
        return options?.exact !== undefined
          ? this.page.getByText(locator, { exact: options.exact })
          : this.page.getByText(locator);
        break;
      case "getByLabel":
        return this.page.getByLabel(locator);
        break;
      case "getByPlaceholder":
        return this.page.getByPlaceholder(locator);
        break;
      case "getByAltText":
        return this.page.getByAltText(locator);
        break;
      case "getByTitle":
        return this.page.getByTitle(locator);
        break;
      case "getByRole":
        if (!options?.role) {
          throw new Error("Role is required for getByRole locator");
        }
        return this.page.getByRole(options?.role as any, {
          name: options.name ?? locator,
          ...(options.exact !== undefined ? { exact: options.exact } : {}),
        });
        break;
      case "getByTestId":
        return this.page.getByTestId(locator);
        break;
      default:
        throw new Error(`Unsupported locator type: ${locatorType}`);
    }
  }

  getChildRoleLocator(
    parent: Locator,
    role: string,
    options?: { exact?: boolean; name?: string },
  ): Locator {
    return parent.getByRole(role as any, {
      ...(options?.name !== undefined ? { name: options.name } : {}),
      ...(options?.exact !== undefined ? { exact: options.exact } : {}),
    });
  }

  // Launch the application and verify the title of the page(optional)
  async launchApplication(url: string, expectedTitle?: string): Promise<void> {
    this.log.info(`Launching application: ${url}`);
    await this.page.goto(url);
    await this.page.waitForLoadState("load");
    if (expectedTitle) {
      await expect(this.page).toHaveTitle(expectedTitle);
    }
  }

  // generate web element from the locator
  async element(locator: flex): Promise<Locator> {
    const element =
      typeof locator === "string" ? this.page.locator(locator) : locator;
    await expect(element).toBeVisible();
    return element;
  }

  // scroll to the target element when the element is not visible on the page
  async scrollToElement(locator: flex): Promise<void> {
    const element = await this.element(locator);
    await element.scrollIntoViewIfNeeded();
  }

  // click on the target element
  async clickElement(locator: flex): Promise<void> {
    const element = await this.element(locator);
    this.log.debug(`click ${this.describe(locator)}`);
    await element.click();
  }

  async clickNthElement(locator: flex, index: number): Promise<void> {
    this.log.debug(`click ${this.describe(locator)} at index ${index}`);
    const elements =
      typeof locator === "string" ? this.page.locator(locator) : locator;
    const element = elements.nth(index);
    await expect(element).toBeVisible();
    await element.click();
  }

  // double click on the target element
  async doubleClickElement(locator: flex): Promise<void> {
    const element = await this.element(locator);
    this.log.debug(`double click ${this.describe(locator)}`);
    await element.dblclick();
  }

  // click on the target element with force option
  async clickElementWithForce(locator: flex): Promise<void> {
    const element = await this.element(locator);
    this.log.debug(`click with force ${this.describe(locator)}`);
    await element.click({ force: true });
  }

  // click on the target element with delay option
  async clickElementWithDelay(locator: flex, delay: number): Promise<void> {
    const element = await this.element(locator);
    this.log.debug(`click with delay ${this.describe(locator)}`);
    await element.click({ delay });
  }
  // Method to press a key on the page
  async pressKey(key: string): Promise<void> {
    this.log.debug(`press key ${key}`);
    await this.page.keyboard.press(key);
  }

  // type text into the target element
  async typeText(locator: flex, text: string): Promise<void> {
    const element = await this.element(locator);
    this.log.debug(`type text into ${this.describe(locator)}: ${text}`);
    await element.fill(text);
  }
  // Method to verify field is editable or not by checking the attribute readonly of the target element
  async verifyElementIsEditable(
    locator: flex,
    isEditable: boolean,
  ): Promise<void> {
    const element = await this.element(locator);
    this.log.debug(
      `verify element is editable: ${this.describe(locator)} - expected: ${isEditable}`,
    );
    const isReadOnly = (await element.getAttribute("readonly")) !== null;
    if (isEditable) {
      expect(isReadOnly).toBe(false);
    } else {
      expect(isReadOnly).toBe(true);
    }
  }

  // get the text from the target element
  async getText(locator: flex): Promise<string> {
    const element = await this.element(locator);
    this.log.debug(`get text from ${this.describe(locator)}`);
    return (await element.textContent()) || "";
  }

  //Common method to get the text from an element
  async getElementText(locator: flex): Promise<string | null> {
    const element = await this.element(locator);
    this.log.debug(`get element text from ${this.describe(locator)}`);
    await this.scrollToElement(locator);
    return await element.textContent();
  }
  // Common method to get Inner text from an element
  async getElementInnerText(locator: flex): Promise<string | null> {
    const element = await this.element(locator);
    this.log.debug(`get element inner text from ${this.describe(locator)}`);
    await this.scrollToElement(locator);
    return await element.innerText();
  }
  // common method to get all inner text from an element
  async getAllInnerText(locator: flex): Promise<string[]> {
    const element = await this.element(locator);
    this.log.debug(`get all inner text from ${this.describe(locator)}`);
    await this.scrollToElement(locator);
    return (await element.allInnerTexts()) || [];
  }
  // Or

  async getAllInnerTextElement(locator: string): Promise<string[]> {
    this.log.debug(`get all inner text from elements matching ${locator}`);
    const elements = await this.page.locator(locator).allInnerTexts();
    await this.scrollToElement(locator);
    return elements
      .map((item) => item.trim())
      .filter((item) => item.length > 0);
  }

  // Common method to get element in array of text from an element
  async getAllTextContent(locator: string): Promise<string[]> {
    this.log.debug(`get all text content from elements matching ${locator}`);
    const element = await this.element(locator);
    await this.scrollToElement(locator);
    return (await element.allTextContents()) || [];
  }
  // coommon method to get all text content from an element

  async getAllTextContentElement(locator: string): Promise<string[]> {
    this.log.debug(`get all text content from elements matching ${locator}`);
    const items = await this.page.locator(locator).allTextContents();
    return items.map((item) => item.trim()).filter((item) => item.length > 0);
  }

  // verify the text of the target element
  async verifyText(locator: flex, expectedText: string): Promise<void> {
    const actualText = await this.getText(locator);
    this.log.debug(
      `verify text of element ${this.describe(locator)} - expected: ${expectedText}`,
    );
    expect(actualText.trim()).toBe(expectedText);
  }
  // clear the text from the target element
  async clearText(locator: flex): Promise<void> {
    const element = await this.element(locator);
    this.log.debug(`clear text from element ${this.describe(locator)}`);
    await this.scrollToElement(locator);
    await element.fill("");
  }

  // verify the visibility of the target element
  async verifyElementVisibility(
    locator: flex,
    isVisible: boolean,
  ): Promise<void> {
    const element = await this.element(locator);
    this.log.debug(
      `verify element visibility of ${this.describe(locator)} - expected: ${isVisible}`,
    );
    if (isVisible) {
      await expect(element).toBeVisible();
    } else {
      await expect(element).toBeHidden();
    }
  }
  // verify the the element is enabled or disabled
  async verifyElementIsEnabled(
    locator: flex,
    isEnabled: boolean,
  ): Promise<void> {
    const element = await this.element(locator);
    this.log.debug(
      `verify element is enabled ${this.describe(locator)} - expected: ${isEnabled}`,
    );
    if (isEnabled) {
      await expect(element).toBeEnabled();
    } else {
      await expect(element).toBeDisabled();
    }
  }

  // verify the attribute of the target element
  async verifyElementAttribute(
    locator: flex,
    attributeName: string,
    expectedValue: string,
  ): Promise<void> {
    const element = await this.element(locator);
    this.log.debug(
      `verify element attribute ${this.describe(locator)} - attribute: ${attributeName} - expected: ${expectedValue}`,
    );
    const actualValue = await element.getAttribute(attributeName);
    expect(actualValue).toBe(expectedValue);
  }

  // verify the CSS property of the target element
  async verifyElementCssProperty(
    locator: flex,
    propertyName: string,
    expectedValue: string,
  ): Promise<void> {
    this.log.debug(
      `verify element CSS property ${this.describe(locator)} - property: ${propertyName} - expected: ${expectedValue}`,
    );
    const element = await this.element(locator);
    const actualValue = await element.evaluate(
      (el, prop) => getComputedStyle(el).getPropertyValue(prop),
      propertyName,
    );
    expect(actualValue.trim()).toBe(expectedValue);
  }
  // verify the count of the target elements
  async verifyElementCount(
    locator: string,
    expectedCount: number,
  ): Promise<void> {
    const elements = this.page.locator(locator);
    this.log.debug(
      `verify element count for ${locator} - expected: ${expectedCount}`,
    );
    const actualCount = await elements.count();
    expect(actualCount).toBe(expectedCount);
  }

  //common method to wait for page load
  async waitForPageLoad(timeout: number = 5000): Promise<void> {
    this.log.debug(`wait for page load with timeout: ${timeout}`);
    await this.page.waitForLoadState("load", { timeout });
  }
  //Common method to wait for the element to be visible
  async waitForElementVisible(
    locator: string,
    timeout: number = 5000,
  ): Promise<void> {
    const element = this.page.locator(locator);
    this.log.debug(
      `wait for element to be visible ${locator} with timeout: ${timeout}`,
    );
    await expect(element).toBeVisible({ timeout });
  }

  // Common method to wait for the element to be hidden
  async waitForElementHidden(
    locator: string,
    timeout: number = 5000,
  ): Promise<void> {
    const element = this.page.locator(locator);
    this.log.debug(
      `wait for element to be hidden ${locator} with timeout: ${timeout}`,
    );
    await expect(element).toBeHidden({ timeout });
  }
  // Common method to wait for the element to be enabled
  async waitForElementEnabled(
    locator: string,
    timeout: number = 5000,
  ): Promise<void> {
    const element = this.page.locator(locator);
    this.log.debug(
      `wait for element to be enabled ${locator} with timeout: ${timeout}`,
    );
    await expect(element).toBeEnabled({ timeout });
  }
  // common method to wait for the element to be disabled
  async waitForElementDisabled(
    locator: string,
    timeout: number = 5000,
  ): Promise<void> {
    const element = this.page.locator(locator);
    this.log.debug(
      `wait for element to be disabled ${locator} with timeout: ${timeout}`,
    );
    await expect(element).toBeDisabled({ timeout });
  }
  // common method to select an option from a dropdown
  async selectOption(
    locator: flex,
    option: { label?: string; value?: string; index?: number },
  ): Promise<void> {
    const element = await this.element(locator);
    this.log.debug(
      `select option ${JSON.stringify(option)} for element ${this.describe(locator)}`,
    );
    const tagName = await element.evaluate((node) => node.tagName);
    if (tagName === "SELECT") {
      await element.selectOption(option);
      return;
    }

    await element.click();
    const optionName = option.label ?? option.value;
    this.log.debug(`selecting custom dropdown option with name: ${optionName}`);
    if (!optionName) {
      throw new Error(
        "A label or value is required to select a custom dropdown option",
      );
    }
    await this.page.getByRole("option", { name: optionName }).click();
  }

  // common method to check a checkbox/radio button/uncheck a checkbox/radio button
  async setCheckboxState(locator: flex, checked: boolean): Promise<void> {
    const element = await this.element(locator);
    this.log.debug(
      `set checkbox state for element ${this.describe(locator)} - expected: ${checked}`,
    );
    const isChecked = await element.isChecked();
    if (isChecked !== checked) {
      await element.click();
    }
  }

  // common method to hover over an element
  async hoverOverElement(locator: flex): Promise<void> {
    const element = await this.element(locator);
    this.log.debug(`hover over element ${this.describe(locator)}`);
    await element.hover();
  }
  // common method to drag and drop an element
  async dragAndDrop(
    sourceLocator: string,
    targetLocator: string,
  ): Promise<void> {
    const sourceElement = await this.element(sourceLocator);
    const targetElement = await this.element(targetLocator);
    this.log.debug(
      `dragging element ${this.describe(sourceLocator)} to ${this.describe(targetLocator)}`,
    );
    await sourceElement.dragTo(targetElement);
  }
  // common method to take a screenshot of the page
  async takeScreenshot(path: string): Promise<void> {
    this.log.debug(`taking screenshot of the page - path: ${path}`);
    await this.page.screenshot({ path });
  }

  // common method to take a screenshot of the target element
  async takeElementScreenshot(locator: flex, path: string): Promise<void> {
    const element = await this.element(locator);
    this.log.debug(
      `taking screenshot of element ${this.describe(locator)} - path: ${path}`,
    );
    await element.screenshot({ path });
  }
  // common method to get the current URL of the page
  async getCurrentUrl(): Promise<string> {
    this.log.debug(`getting current URL of the page`);
    return this.page.url();
  }

  // get locator method has-text
  async getLocatorHasText(locator: flex, text: string): Promise<Locator> {
    this.log.debug(
      `getting locator with has-text for element ${this.describe(locator)} and text: "${text}"`,
    );
    return this.page.locator(`${locator}:has-text("${text}")`);
  }

  // Common method for nth element selection
  async getNthElement(locator: string, index: number): Promise<Locator> {
    const elements = this.page.locator(locator);
    this.log.debug(`getting the ${index}th element for locator ${locator}`);
    const count = await elements.count();
    if (index < 0 || index >= count) {
      throw new Error(
        `Index ${index} is out of bounds for locator ${locator}. Total elements found: ${count}`,
      );
    }
    return elements.nth(index);
  }
}
