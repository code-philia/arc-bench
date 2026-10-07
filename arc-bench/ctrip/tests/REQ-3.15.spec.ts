// requirement: REQ-3.15
import { test, expect } from "@playwright/test";
import { button, region, checkbox, total, openHome, installClock, openBooking } from "./helpers";

test.beforeEach(async ({ page }) => { await installClock(page); });

test('REQ-3.15: Remove airport lounge service', async ({ page }, testInfo) => {
  await openHome(page);
  await openBooking(page);
  await checkbox(region(page, 'Airport services'), 'Tianfu T2 lounge').check();
  await total(page, 610);
  await checkbox(region(page, 'Airport services'), 'Tianfu T2 lounge').uncheck();
  await expect(checkbox(region(page, 'Airport services'), 'Tianfu T2 lounge')).not.toBeChecked();
  await total(page, 530);
  await button(page, 'Fee details').click();
  await expect(region(page, 'Fee details').getByText('Tianfu T2 lounge: ¥80', { exact: true })).toHaveCount(0);
});
