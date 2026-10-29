---
name: browser-screenshots
description: Render paidacross pages in a real headless Chromium and screenshot them at phone and desktop widths, in Claude Code cloud sessions. Use when a design or UX skill (impeccable, frontend-design) says to verify by looking at the rendered result, or when checking a page after a UI change.
---

# Browser screenshots in this repo

Playwright is already a dev dependency (`playwright` and `@playwright/test` 1.60). In Claude Code cloud
sessions a Chromium build is pre-installed at `/opt/pw-browsers`, but it is not the revision this
Playwright version expects, so a plain `chromium.launch()` fails with "Executable doesn't exist ...
chromium_headless_shell-1223". Always pass `executablePath`. Do not run `npx playwright install`.

```js
import pw from '/home/user/nomad-stack/node_modules/playwright/index.js';
const browser = await pw.chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
```

On a local machine with its own Playwright browsers, drop `executablePath`.

## Recipe

1. Build and serve the app: `npm run build`, then start `npx next start -p 3457` in the background and
   wait until `curl -s -o /dev/null -w "%{http_code}" localhost:3457/` returns 200. For a page that is
   already deployed, use `https://paidacross.com/...` and skip this step.
2. Write a script in the session scratchpad (not in the repo), for example:

```js
import pw from '/home/user/nomad-stack/node_modules/playwright/index.js';
const base = process.argv[2] ?? 'http://localhost:3457';
const paths = process.argv.slice(3).length ? process.argv.slice(3) : ['/'];
const browser = await pw.chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
for (const [label, viewport] of [['mobile', { width: 390, height: 844 }], ['desktop', { width: 1280, height: 900 }]]) {
  const page = await browser.newPage({ viewport });
  for (const p of paths) {
    await page.goto(base + p, { waitUntil: 'networkidle' });
    const name = `${label}${p.replace(/\//g, '_') || '_home'}.png`;
    await page.screenshot({ path: name, fullPage: true });
    console.log('saved', name);
  }
  await page.close();
}
await browser.close();
```

3. Run it with `node shot.mjs http://localhost:3457 / /receive/usd-to-php`, then open the PNGs with the
   Read tool and actually look at them. Check the 390px width for horizontal scroll, the calculator,
   and the comparison table.
4. Stop the server with `fuser -k 3457/tcp` when done.

Reader-facing copy rules from AGENTS.md still apply to anything a design pass changes: no em or en
dashes, the humanizer on new copy, and the fee model and page copy must agree.
