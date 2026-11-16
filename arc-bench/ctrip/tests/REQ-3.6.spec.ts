// requirement: REQ-3.6
import { expect } from "@playwright/test";
import { test, setChecked, field, button, region, dialog, checkbox, textVisible, total, openHome, openBooking } from "./helpers";

test('REQ-3.6: Add combo insurance', async ({ page }) => {
  await openHome(page);
  await openBooking(page);
  await total(page, 530);
  await setChecked(checkbox(region(page, 'Trip protection'), 'Combo insurance'));
  await expect(checkbox(region(page, 'Trip protection'), 'Combo insurance')).toBeChecked();
  await textVisible(region(page, 'Fee breakdown'), 'Combo insurance: ¥40');
  await total(page, 570);
});

test('REQ-3.6: Read insurance coverage and claims', async ({ page }) => {
  await openHome(page);
  await openBooking(page);
  await button(region(page, 'Trip protection'), 'Insurance terms').click();
  await textVisible(dialog(page, 'Insurance terms'), 'Flight delay coverage');
  await textVisible(dialog(page, 'Insurance terms'), 'Coverage limit: ¥1000');
  await textVisible(dialog(page, 'Insurance terms'), 'How to claim');
});

test('REQ-3.6: Read free checked baggage', async ({ page }) => {
  await openHome(page);
  await openBooking(page);
  await textVisible(region(page, 'Baggage allowance'), 'Free checked baggage: 20 kg');
});

test('REQ-3.6: Purchase extra checked baggage', async ({ page }) => {
  await openHome(page);
  await openBooking(page);
  await total(page, 530);
  await setChecked(checkbox(region(page, 'Baggage allowance'), 'Extra 10 kg'));
  await textVisible(region(page, 'Baggage allowance'), 'Checked baggage: 30 kg');
  await textVisible(region(page, 'Fee breakdown'), 'Extra 10 kg: ¥60');
  await total(page, 590);
});

test('REQ-3.6: Reserve airport drop-off', async ({ page }) => {
  await openHome(page);
  await openBooking(page);
  await total(page, 530);
  await field(region(page, 'Airport transfer'), 'Pickup address').fill('No. 1 Tianfu Avenue, Chengdu');
  await setChecked(checkbox(region(page, 'Airport transfer'), 'Airport drop-off'));
  await textVisible(region(page, 'Airport transfer'), 'Estimated fare: ¥42');
  await textVisible(region(page, 'Fee breakdown'), 'Airport drop-off: ¥42');
  await total(page, 572);
});

test('REQ-3.6: Purchase airport lounge', async ({ page }) => {
  await openHome(page);
  await openBooking(page);
  await total(page, 530);
  await setChecked(checkbox(region(page, 'Airport services'), 'Tianfu T2 lounge'));
  await expect(checkbox(region(page, 'Airport services'), 'Tianfu T2 lounge')).toBeChecked();
  await textVisible(region(page, 'Fee breakdown'), 'Tianfu T2 lounge: ¥80');
  await total(page, 610);
});
