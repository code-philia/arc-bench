// requirement: REQ-3.13
import { test, expect } from "@playwright/test";
import { button, region, checkbox, textVisible, total, openHome, installClock, openBooking } from "./helpers";

test.beforeEach(async ({ page }) => { await installClock(page); });

test('REQ-3.13: Remove purchased extra baggage', async ({ page }, testInfo) => {
  await openHome(page);
  await openBooking(page);
  await checkbox(region(page, 'Baggage allowance'), 'Extra 10 kg').check();
  await total(page, 590);
  await textVisible(region(page, 'Baggage allowance'), 'Checked baggage: 30 kg');
  await checkbox(region(page, 'Baggage allowance'), 'Extra 10 kg').uncheck();
  await expect(checkbox(region(page, 'Baggage allowance'), 'Extra 10 kg')).not.toBeChecked();
  await total(page, 530);
  await button(page, 'Fee details').click();
  await expect(region(page, 'Fee details').getByText('Extra 10 kg: ¥60', { exact: true })).toHaveCount(0);
  await textVisible(region(page, 'Baggage allowance'), 'Free checked baggage: 20 kg');
  await expect(region(page, 'Baggage allowance').getByText('Checked baggage: 30 kg', { exact: true })).not.toBeVisible();
});
