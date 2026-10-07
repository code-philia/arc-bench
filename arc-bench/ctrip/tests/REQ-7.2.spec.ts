// requirement: REQ-7.2
import { test, expect } from "@playwright/test";
import { region, flight, textVisible, openHome, installClock, openStatus, queryStatusNumber } from "./helpers";

test.beforeEach(async ({ page }) => { await installClock(page); });

test('REQ-7.2: Show identified flight ground service details', async ({ page }, testInfo) => {
  await openHome(page);
  await openStatus(page);
  await queryStatusNumber(page, 'JD5162');
  for (const value of ['JD5162', 'Chengdu', 'Guangzhou', 'Scheduled', 'H14-H25', 'B12']) await textVisible(region(page, 'Flight details'), value);
  await textVisible(region(region(page, 'Flight details'), 'Baggage carousel'), '6');
});

