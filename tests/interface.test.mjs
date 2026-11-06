import { BASE_URL, launchBrowser } from './browser.mjs';

const BASE = BASE_URL;
const failures = [];

function check(condition, message) {
  if (condition) {
    console.log(`PASS  ${message}`);
  } else {
    failures.push(message);
    console.log(`FAIL  ${message}`);
  }
}

const browser = await launchBrowser();

const context = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
  permissions: ['clipboard-read', 'clipboard-write'],
});
const page = await context.newPage();
const runtimeErrors = [];
page.on('console', (message) => {
  if (message.type() === 'error') runtimeErrors.push(message.text());
});
page.on('pageerror', (error) => runtimeErrors.push(error.message));

await page.goto(BASE, { waitUntil: 'networkidle' });
await page.waitForTimeout(1200);

check((await page.locator('h1').getAttribute('aria-label')) === "We're making things better.", 'hero heading is present');
check((await page.locator('.service-card').count()) === 6, 'six system components are rendered');
check((await page.locator('.timeline-tab').count()) === 4, 'four timeline stages are rendered');
check((await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)), 'desktop has no horizontal overflow');

const firstClock = await page.locator('.header-clock time').innerText();
await page.waitForTimeout(1200);
const secondClock = await page.locator('.header-clock time').innerText();
check(firstClock !== secondClock, 'live clock advances');

await page.locator('.primary-nav a[href="#systems"]').click();
await page.waitForTimeout(900);
check((await page.evaluate(() => window.scrollY)) > 400, 'smooth section navigation scrolls to systems');

const firstCard = page.locator('.service-card').first();
const firstTrigger = firstCard.locator('.service-trigger');
await firstTrigger.click();
await page.waitForTimeout(700);
check((await firstTrigger.getAttribute('aria-expanded')) === 'true', 'service card expands');
check(await firstCard.locator('.service-detail').isVisible(), 'service detail is visible when expanded');
check((await firstCard.locator('.service-detail').getAttribute('aria-hidden')) === 'false', 'service detail aria state updates');
await firstTrigger.press('Enter');
await page.waitForTimeout(650);
check((await firstTrigger.getAttribute('aria-expanded')) === 'false', 'service card collapses via keyboard');

await page.locator('.timeline-tab').first().focus();
await page.keyboard.press('ArrowRight');
await page.waitForTimeout(350);
check((await page.locator('.timeline-tab').nth(1).getAttribute('aria-selected')) === 'true', 'timeline tabs support arrow-key navigation');
await page.locator('.timeline-tab').nth(3).click();
await page.waitForTimeout(500);
check((await page.locator('.timeline-panel-copy h3').innerText()) === 'Services restored', 'timeline selection updates the detail panel');
check((await page.locator('.timeline-panel-state').innerText()).includes('UPCOMING'), 'upcoming timeline stage state is shown');

await page.locator('.diagnostic-button').click();
await page.waitForTimeout(2600);
check((await page.locator('.diagnostic-copy > span').first().innerText()) === 'DIAGNOSTIC PASSED', 'diagnostic simulation completes');

await page.locator('#updates').scrollIntoViewIfNeeded();
await page.waitForTimeout(500);
await page.locator('#subscriber-email').fill('not-an-email');
await page.locator('.submit-button').click();
await page.waitForTimeout(250);
check((await page.locator('.field-note').innerText()) === 'Enter a valid email address.', 'invalid email shows an error');

await page.locator('#subscriber-email').fill('studio@example.com');
await page.locator('.checkbox-row').first().click();
await page.locator('.checkbox-row').nth(1).click();
await page.locator('.submit-button').click();
await page.waitForTimeout(250);
check((await page.locator('.field-note').innerText()) === 'Select at least one update preference.', 'empty alert preferences show an error');

await page.locator('.checkbox-row').first().click();
await page.locator('.submit-button').click();
await page.waitForTimeout(1600);
check((await page.locator('.subscription-success').count()) === 1, 'valid subscription shows a simulated success state');
check((await page.locator('.subscription-success p').innerText()).includes('studio@example.com'), 'success state echoes supplied email');
await page.locator('.text-button').click();
await page.waitForTimeout(300);
check((await page.locator('.subscribe-form').count()) === 1, 'subscription success can be reset');

await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
await page.waitForTimeout(700);
await page.locator('.site-footer .copy-button').click();
await page.waitForTimeout(250);
check((await page.locator('.site-footer .copy-button').innerText()).includes('COPIED'), 'maintenance reference copies to clipboard');
const clipboard = await page.evaluate(() => navigator.clipboard.readText());
check(clipboard === 'NF-MNT-8841-06', 'clipboard contains the maintenance reference');

const menuTrigger = page.locator('.menu-trigger');
await menuTrigger.click();
await page.waitForTimeout(400);
check(await page.locator('.menu-overlay').isVisible(), 'menu overlay opens');
check((await page.evaluate(() => document.querySelector('.site-shell')?.hasAttribute('inert'))) === true, 'background content is inert while menu is open');
check((await page.evaluate(() => document.activeElement?.classList.contains('menu-close'))) === true, 'menu moves focus to its close control');
await page.keyboard.press('Shift+Tab');
check((await page.evaluate(() => document.activeElement?.classList.contains('copy-button'))) === true, 'menu traps keyboard focus');
await page.keyboard.press('Escape');
await page.waitForTimeout(300);
check((await page.locator('.menu-overlay').count()) === 0, 'Escape closes the menu');
check((await page.evaluate(() => document.activeElement?.classList.contains('menu-trigger'))) === true, 'focus returns to the menu trigger');

for (const width of [1024, 768, 390, 360]) {
  await page.setViewportSize({ width, height: 900 });
  await page.waitForTimeout(350);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  check(!overflow, `no horizontal overflow at ${width}px`);
}

check(runtimeErrors.length === 0, `no runtime console errors${runtimeErrors.length ? `: ${runtimeErrors.join(' | ')}` : ''}`);
await browser.close();

console.log(`\n${failures.length === 0 ? 'All interface checks passed.' : `${failures.length} check(s) failed.`}`);
if (failures.length > 0) process.exitCode = 1;
