import dotenv from "dotenv";
import rawConfig from "./config.json" with { type: "json" };

dotenv.config({ override: !process.env.CI });

/**
 * Timeout constants for Playwright test automation
 * All timeouts are in milliseconds
 */
export const TIMEOUTS = {
  SHORT: 3000, // 3 seconds - for quick operations
  DEFAULT: 5000, // 5 seconds - standard wait time
  EXTENDED: 10000, // 10 seconds - for longer operations
  LONG: 15000, // 15 seconds - for heavy operations
  NAVIGATION: 30000, // 30 seconds - for page navigation
} as const;

const environmentName = (
  process.env.TEST_ENV ??
  process.env.ENVIRONMENT ??
  rawConfig.defaultEnvironment
).toLowerCase();

const environment =
  rawConfig.environments[
    environmentName as keyof typeof rawConfig.environments
  ];
if (!environment) {
  throw new Error(
    `Unsupported environment '${environmentName}'. Supported environments: ${Object.keys(rawConfig.environments).join(", ")}`,
  );
}

const environmentPrefix = environmentName.toUpperCase();
const appUrl =
  process.env[`${environmentPrefix}_APP_URL`] ??
  process.env.APP_URL ??
  environment.appUrl ??
  rawConfig.app.url;
const apiBaseUrl =
  process.env[`${environmentPrefix}_API_BASE_URL`] ??
  process.env.API_BASE_URL ??
  (environment.apiBaseUrl || rawConfig.api.baseUrl);

if (!appUrl) {
  throw new Error(
    `APP_URL is required when TEST_ENV=${environmentName} has no configured application URL.`,
  );
}

export const runtimeConfig = {
  ...rawConfig,
  app: { ...rawConfig.app, url: appUrl },
  api: {
    ...rawConfig.api,
    baseUrl: apiBaseUrl,
    Authorization: process.env.API_AUTHORIZATION ?? rawConfig.api.Authorization,
    "x-api-key": process.env.API_KEY ?? rawConfig.api["x-api-key"],
  },
  db: {
    ...rawConfig.db,
    host:
      process.env[`${environmentPrefix}_DB_HOST`] ??
      process.env.DB_HOST ??
      rawConfig.db.host,
    port: Number(
      process.env[`${environmentPrefix}_DB_PORT`] ??
        process.env.DB_PORT ??
        rawConfig.db.port,
    ),
    username:
      process.env[`${environmentPrefix}_DB_USERNAME`] ??
      process.env.DB_USERNAME ??
      rawConfig.db.username,
    password:
      process.env[`${environmentPrefix}_DB_PASSWORD`] ??
      process.env.DB_PASSWORD ??
      rawConfig.db.password,
    database:
      process.env[`${environmentPrefix}_DB_NAME`] ??
      process.env.DB_NAME ??
      rawConfig.db.database,
  },
} as const;

export const runtimeCredentials = {
  username:
    process.env[`${environmentPrefix}_USERNAME`] ?? process.env.USERNAME,
  password:
    process.env[`${environmentPrefix}_PASSWORD`] ?? process.env.PASSWORD,
};
