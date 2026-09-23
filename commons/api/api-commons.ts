import { request, expect } from "@playwright/test";
import { runtimeConfig as config } from "../../config/config-timouts.ts";
import data from "../../testdata/api/data.json" with { type: "json" };

export class ApiCommons {
  private requestContext: any; // Request context is all about pre-request that needs to be set up before sending API reuest.
  private response: any; // Response variable will be used to store the output response recived from API server.
  private bearerToken!: string;

  // Common methods create the request context(The Method that we are going to use to add base URL, headers, and other pre-request configurations)
  async InitializeRequestContext() {
    this.requestContext = await request.newContext({
      baseURL: config.api.baseUrl,
      extraHTTPHeaders: {
        Authorization: config.api.Authorization,
        "x-api-key": config.api["x-api-key"],
      },
    });
  }

  // Common method to send the API request and get the response
  async getResponse(requestType: string, endpoint: string, playload?: any) {
    // Convert request type to lowercase for consistency
    requestType = requestType.toLowerCase();

    // Based on the request type, send the request and get the response
    switch (requestType) {
      case "get":
        this.response = await this.requestContext.get(endpoint);
        break;
      case "post":
        this.response = await this.requestContext.post(endpoint, {
          data: playload,
        });
        break;
      case "put":
        this.response = await this.requestContext.put(endpoint, {
          data: playload,
        });
        break;
      case "patch":
        this.response = await this.requestContext.patch(endpoint, {
          data: playload,
        });
        break;
      case "delete":
        this.response = await this.requestContext.delete(endpoint);
        break;
      default:
        throw new Error(`Unsupported request type: ${requestType}`);
    }
    return this.response;
  }

  // Common method to validate the status code
  async validateStatusCode(expectedStatusCode: number) {
    const actualStatusCode = await this.response.status();
    await expect(actualStatusCode).toBe(expectedStatusCode);
  }
  // Common method to validate the status message
  async validateStatusMessage(expectedStatusMessage: string) {
    const actualStatusMessage = await this.response.statusText();
    await expect(actualStatusMessage).toBe(expectedStatusMessage);
  }

  // Common method to validate the response body
  async validateResponseBody(key: string, expectedValue: any) {
    const responseBody = await this.response.json();
    const actualResponseBody = responseBody[key];
    expect(actualResponseBody).toEqual(expectedValue);
  }

  // Common method to validate the response headers
  async validateResponseHeader(headerName: string, expectedValue: any) {
    const responseHeaders = await this.response.headers();
    const actualHeaderValue = responseHeaders[headerName];
    await expect(actualHeaderValue).toEqual(expectedValue);
  }
  // common method to validate the response schema
  async validateResponseSchema(key: string, expectedDataType: string) {
    const responseBody = await this.response.json();
    const actualValue = responseBody[key];
    const actualDataType = typeof actualValue;
    await expect(actualDataType).toBe(expectedDataType);
  }

  // Common method to validate the response time
  async validateResponseTime(expectedTimeInMs: number) {
    const actualTimeInMs =
      (await this.response.timing()).responseEnd -
      (await this.response.timing()).requestStart;
    await expect(actualTimeInMs).toBeLessThanOrEqual(expectedTimeInMs);
  }
}
