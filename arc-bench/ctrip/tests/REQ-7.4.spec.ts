// requirement: REQ-7.4
import { test, expect } from "@playwright/test";
import { action, region, flight, textVisible, openHome, installClock, loginOwner, openStatus, queryStatusNumber } from "./helpers";

test.beforeEach(async ({ page }) => { await installClock(page); });

test('REQ-7.4: Record and reuse a flight query', async ({ page }, testInfo) => {
  await openHome(page);
  await loginOwner(page, 'status_history_use');
  await openStatus(page);
  await queryStatusNumber(page, 'JD5162');
  await openStatus(page);
  await action(region(page, 'Search history'), 'JD5162').click();
  for (const value of ['JD5162', 'Chengdu', 'Guangzhou']) await textVisible(region(page, 'Flight details'), value);
});

