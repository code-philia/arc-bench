// requirement: REQ-3.14
import { test, expect } from "@playwright/test";
import { field, button, region, checkbox, total, openHome, installClock, openBooking } from "./helpers";

test.beforeEach(async ({ page }) => { await installClock(page); });

test('REQ-3.14: Remove airport drop-off reservation', async ({ page }, testInfo) => {
  await openHome(page);
  await openBooking(page);
  await field(region(page, 'Airport transfer'), 'Pickup address').fill('No. 1 Tianfu Avenue, Chengdu');
  await checkbox(region(page, 'Airport transfer'), 'Airport drop-off').check();
  await total(page, 572);
  await checkbox(region(page, 'Airport transfer'), 'Airport drop-off').uncheck();
  await expect(checkbox(region(page, 'Airport transfer'), 'Airport drop-off')).not.toBeChecked();
  await total(page, 530);
  await button(page, 'Fee details').click();
  await expect(region(page, 'Fee details').getByText('Airport drop-off: ¥42', { exact: true })).toHaveCount(0);
});
