// requirement: REQ-6.1
import { test, expect } from "@playwright/test";
import { action, textVisible, openHome, installClock, openPersonal } from "./helpers";

test.beforeEach(async ({ page }) => { await installClock(page); });

test('REQ-6.1: Read personal information with masking', async ({ page }, testInfo) => {
  await openHome(page);
  await openPersonal(page, 'profile_read');
  await action(page, 'My information').click();
  for (const value of ['138****0013', 'c***@example.com', 'Profile Reader', 'Li Ming', 'Male', '1990-01-01']) await textVisible(page, value);
});

