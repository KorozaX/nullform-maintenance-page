import { createRequire } from 'node:module';
import { BASE_URL, launchBrowser } from './browser.mjs';

const require = createRequire(import.meta.url);
const axePath = require.resolve('axe-core/axe.min.js');
const browser = await launchBrowser();
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
await page.goto(BASE_URL, { waitUntil: 'networkidle' });

const sections = ['#systems', '#timeline', '#updates'];
for (const selector of sections) {
  await page.locator(selector).scrollIntoViewIfNeeded();
  await page.waitForTimeout(450);
}
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(300);
await page.addScriptTag({ path: axePath });

const result = await page.evaluate(async () => {
  return await window.axe.run(document, {
    runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'] },
  });
});

for (const violation of result.violations) {
  console.log(`\n${violation.impact?.toUpperCase()} ${violation.id}: ${violation.help}`);
  for (const node of violation.nodes.slice(0, 8)) {
    console.log('  ', node.target.join(' '), '—', node.failureSummary?.split('\n')[1] ?? node.failureSummary);
  }
  if (violation.nodes.length > 8) console.log(`  ... ${violation.nodes.length - 8} more`);
}
console.log(`\nVIOLATIONS ${result.violations.length}`);

await browser.close();
