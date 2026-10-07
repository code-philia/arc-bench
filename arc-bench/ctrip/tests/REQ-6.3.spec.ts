// requirement: REQ-6.3
import { test, expect } from "@playwright/test";
import { button, region, visible, textVisible, openHome, installClock, openSecurity } from "./helpers";

test.beforeEach(async ({ page }) => { await installClock(page); });

test('REQ-6.3: Inspect security settings and reminder', async ({ page }, testInfo) => {
  await openHome(page);
  await openSecurity(page, 'profile_read');
  for (const name of ['Login password', 'Bound phone', 'Bound email']) {
   await visible(region(page, name));
   await visible(button(region(page, name), 'Change'));
  }
  await textVisible(page, 'Change your password regularly');
});

