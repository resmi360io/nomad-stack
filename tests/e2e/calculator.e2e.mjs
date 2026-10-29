// Browser tests for calculator state and accessibility. Needs a running build:
//   npm run build && npx next start -p 3457 &
//   BASE=http://localhost:3457 npm run test:e2e
// In Claude Code cloud sessions Playwright needs the pre-installed Chromium (PW_CHROMIUM below);
// locally, leave it unset and Playwright uses its own browser.
import { test, after, before } from 'node:test';
import assert from 'node:assert/strict';
import pw from 'playwright';

const BASE = process.env.BASE ?? 'http://localhost:3457';
const executablePath = process.env.PW_CHROMIUM || undefined;
let browser;
before(async () => { browser = await pw.chromium.launch(executablePath ? { executablePath } : {}); });
after(async () => { await browser?.close(); });

async function open(path, width = 390) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  await page.goto(BASE + path, { waitUntil: 'networkidle' });
  // Rates load client-side; the button is disabled until they arrive.
  await page.waitForFunction(() => !document.querySelector('button[type=submit]')?.disabled);
  return { page, errors };
}
const live = (page) => page.$eval('[role=status][aria-live]', (e) => e.textContent.trim());
const compare = (page) => page.getByRole('button', { name: 'Compare options' }).click();
const results = (page) => page.locator('section[aria-labelledby="results-heading"]');

async function pick(page, label, option) {
  await page.getByRole('combobox', { name: label }).click();
  await page.getByRole('option', { name: option, exact: true }).click();
}

test('US to Pakistan $1,000: personal-remittance price is shown but not ranked, no badge', async () => {
  const { page, errors } = await open('/receive/usd-to-pkr');
  await page.fill('#amount', '1000');
  await compare(page);
  await results(page).waitFor();
  const ranked = await page.$$eval('section[aria-labelledby="results-heading"] ol > li h4', (h) => h.map((x) => x.textContent));
  assert.equal(ranked[0], 'Payoneer');
  assert.ok(!ranked.includes('Western Union'));
  assert.match(await page.textContent('section[aria-labelledby="results-heading"]'), /Personal remittance price/);
  assert.equal(await page.locator('section[aria-labelledby="results-heading"] >> text=Best value').count(), 0);
  assert.match(await live(page), /top: Payoneer\. No best value badge/);
  assert.deepEqual(errors, []);
  await page.close();
});

test('US to Nigeria at $200, $1,000 and $5,000 price, and Grey shows both capped fees at $5,000', async () => {
  const { page } = await open('/receive/usd-to-ngn');
  for (const amt of ['200', '1000', '5000']) {
    await page.fill('#amount', amt);
    await compare(page);
    await results(page).waitFor();
    assert.match(await page.textContent('section[aria-labelledby="results-heading"]'), new RegExp(`USD ${Number(amt).toLocaleString('en-US')}\\.00`));
  }
  const grey = page.locator('li', { has: page.locator('h4', { hasText: /^Grey$/ }) });
  const text = await grey.textContent();
  assert.match(text, /Deposit fee\s*USD 10\.00/);
  assert.match(text, /Conversion fee\s*USD 6\.00/);
  await page.close();
});

test('US to Georgia at $500 and $1,000 in lari and dollars; UK to Georgia GBP 10,000', async () => {
  const { page } = await open('/receive/usd-to-gel');
  for (const amt of ['500', '1000']) {
    await page.fill('#amount', amt);
    await compare(page);
    await results(page).waitFor();
    const body = await page.textContent('section[aria-labelledby="results-heading"]');
    // Payoneer's lari withdrawal is unconfirmed: never ranked.
    const ranked = await page.$$eval('section[aria-labelledby="results-heading"] ol > li h4', (h) => h.map((x) => x.textContent));
    assert.ok(!ranked.includes('Payoneer'), `Payoneer ranked at ${amt}`);
    assert.match(body, /Route not confirmed/);
  }
  await pick(page, 'Recipient receives in', 'USD, US Dollar');
  await compare(page);
  await results(page).waitFor();
  assert.match(await page.textContent('section[aria-labelledby="results-heading"]'), /received in USD/);
  await pick(page, 'From', 'United Kingdom (GBP)');
  await page.fill('#amount', '10000');
  await compare(page);
  await results(page).waitFor();
  assert.match(await page.textContent('section[aria-labelledby="results-heading"]'), /GBP 10,000\.00 from United Kingdom/);
  await page.close();
});

test('changing any input after results marks them stale and announces it once', async () => {
  const { page } = await open('/');
  await compare(page);
  await results(page).waitFor();
  assert.match(await live(page), /^Results updated/);
  await page.fill('#amount', '2500');
  assert.match(await page.textContent('section[aria-labelledby="results-heading"]'), /You changed the inputs/);
  assert.match(await live(page), /out of date/);
  // A second edit does not re-announce.
  await page.fill('#amount', '2600');
  assert.match(await live(page), /out of date/);
  // Changing the destination also marks stale; comparing again clears it.
  await compare(page);
  assert.doesNotMatch(await page.textContent('section[aria-labelledby="results-heading"]'), /You changed the inputs/);
  await pick(page, 'To', 'Nigeria (NGN)');
  assert.match(await page.textContent('section[aria-labelledby="results-heading"]'), /You changed the inputs/);
  // The summary still describes what the numbers were computed for.
  assert.match(await page.textContent('section[aria-labelledby="results-heading"]'), /to Pakistan \(PKR\)/);
  await page.close();
});

for (const bad of ['', '0', '-50', '1e', 'abc']) {
  test(`invalid amount ${JSON.stringify(bad)} shows an error, focuses the field and withdraws old results`, async () => {
    const { page } = await open('/');
    await compare(page);
    await results(page).waitFor();
    // type="number" lets some strings through as '' (the browser drops them), which must also fail.
    await page.fill('#amount', '');
    if (bad) await page.locator('#amount').pressSequentially(bad);
    await compare(page);
    assert.equal(await results(page).count(), 0, 'stale results still shown');
    assert.equal(await page.getAttribute('#amount', 'aria-invalid'), 'true');
    assert.equal(await page.getAttribute('#amount', 'aria-describedby'), 'amount-error');
    assert.equal(await page.evaluate(() => document.activeElement?.id), 'amount');
    assert.match(await page.textContent('#amount-error'), /greater than zero/);
    await page.close();
  });
}

test('a decimal amount is priced', async () => {
  const { page } = await open('/');
  await page.fill('#amount', '1234.56');
  await compare(page);
  await results(page).waitFor();
  assert.match(await page.textContent('section[aria-labelledby="results-heading"]'), /USD 1,234\.56/);
  await page.close();
});

test('dropdowns open and close from the keyboard, and Escape returns focus to the trigger', async () => {
  const { page } = await open('/');
  const trigger = page.getByRole('combobox', { name: 'To' });
  await trigger.focus();
  await page.keyboard.press('Enter');
  await page.getByRole('listbox').waitFor();
  await page.keyboard.press('Escape');
  await page.getByRole('listbox').waitFor({ state: 'detached' });
  assert.equal(await trigger.evaluate((el) => el === document.activeElement), true);
  await page.close();
});

test('skip link is the first tab stop and moves to the main content', async () => {
  const { page } = await open('/receive/usd-to-ngn');
  await page.keyboard.press('Tab');
  assert.equal(await page.evaluate(() => document.activeElement?.textContent?.trim()), 'Skip to main content');
  await page.keyboard.press('Enter');
  assert.equal(await page.evaluate(() => location.hash), '#main-content');
  await page.close();
});

test('provider actions name the provider and match the route type', async () => {
  const { page } = await open('/receive/usd-to-ngn');
  await compare(page);
  await results(page).waitFor();
  const names = await page.$$eval('section[aria-labelledby="results-heading"] a[target=_blank]', (a) => a.map((x) => x.textContent.replace(/\s+/g, ' ').trim()));
  assert.ok(names.some((n) => n.startsWith('Open Grey account')), names.join(' | '));
  assert.ok(names.every((n) => !/^Open account/.test(n)), 'generic CTA left');
  await page.close();
});

test('no horizontal page overflow at 375, 390, 768 and 1366', async () => {
  for (const w of [375, 390, 768, 1366]) {
    for (const path of ['/', '/receive/usd-to-ngn', '/receive/usd-to-gel', '/rates/payoneer-usd-to-pkr']) {
      const { page } = await open(path, w);
      if (await page.locator('#amount').count()) {
        await compare(page);
        await results(page).waitFor();
      }
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      assert.ok(overflow <= 0, `${path} at ${w}: ${overflow}px`);
      await page.close();
    }
  }
});
