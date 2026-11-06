import { chromium } from 'playwright-core';

export const BASE_URL = process.env.BASE_URL ?? 'http://127.0.0.1:4173/';
export const CHROME_PATH =
  process.env.CHROME_PATH ?? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

export function launchBrowser() {
  return chromium.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--force-color-profile=srgb'],
  });
}
