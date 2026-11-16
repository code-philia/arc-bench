// requirement: REQ-3.13
import { expect } from "@playwright/test";
import { test, setChecked, button, region, checkbox, textVisible, total, openHome, openBooking } from "./helpers";

test('REQ-3.13: Remove purchased extra baggage', async ({ page }) => {
  await openHome(page);
  await openBooking(page);
  await setChecked(checkbox(region(page, 'Baggage allowance'), 'Extra 10 kg'));
  await total(page, 590);
  await textVisible(region(page, 'Baggage allowance'), 'Checked baggage: 30 kg');
  await setChecked(checkbox(region(page, 'Baggage allowance'), 'Extra 10 kg'), false);
  await expect(checkbox(region(page, 'Baggage allowance'), 'Extra 10 kg')).not.toBeChecked();
  await total(page, 530);
  await button(page, 'Fee details').click();
  await expect(region(page, 'Fee details').getByText('Extra 10 kg: ¥60', { exact: true })).toHaveCount(0);
  await textVisible(region(page, 'Baggage allowance'), 'Free checked baggage: 20 kg');
  await expect(region(page, 'Baggage allowance').getByText('Checked baggage: 30 kg', { exact: true })).not.toBeVisible();
});
