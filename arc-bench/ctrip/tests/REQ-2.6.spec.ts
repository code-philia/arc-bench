// requirement: REQ-2.6
import { test, expect } from "@playwright/test";
import { field, action, region, heading, openHome, installClock } from "./helpers";

test.beforeEach(async ({ page }) => { await installClock(page); });

test('REQ-2.6: Reuse anonymous route history', async ({ page }, testInfo) => {
  await openHome(page);
  await action(region(page, 'Search history'), 'Chengdu - Guangzhou').click();
  await heading(page, 'Flight results');
  await expect(field(page, 'Origin')).toHaveValue('Chengdu');
  await expect(field(page, 'Destination')).toHaveValue('Guangzhou');
  await expect(field(page, 'Departure date')).toHaveValue('2026-07-21');
});

