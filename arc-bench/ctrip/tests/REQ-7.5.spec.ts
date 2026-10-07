// requirement: REQ-7.5
import { test, expect } from "@playwright/test";
import { button, action, region, visible, textVisible, openHome, installClock, loginOwner, openStatus, queryStatusNumber } from "./helpers";

test.beforeEach(async ({ page }) => { await installClock(page); });

test('REQ-7.5: Clear account search history', async ({ page }, testInfo) => {
  await openHome(page);
  await loginOwner(page, 'status_history_clear');
  await openStatus(page);
  await queryStatusNumber(page, 'MU5234');
  await openStatus(page);
  await visible(action(region(page, 'Search history'), 'MU5234'));
  await button(region(page, 'Search history'), 'Clear history').click();
  await expect(action(region(page, 'Search history'), 'MU5234')).toHaveCount(0);
  await textVisible(region(page, 'Search history'), 'No search history');
  await page.reload();
  await expect(action(region(page, 'Search history'), 'MU5234')).toHaveCount(0);
  await textVisible(region(page, 'Search history'), 'No search history');
});

