// requirement: REQ-3.7
import { expect } from "@playwright/test";
import { test, setChecked, button, region, checkbox, textVisible, total, openHome, openBooking } from "./helpers";

test('REQ-3.7: Compose optional fee details', async ({ page }) => {
  await openHome(page);
  await openBooking(page);
  await total(page, 530);
  await setChecked(checkbox(page, 'Combo insurance'));
  await setChecked(checkbox(page, 'Extra 10 kg'));
  await button(page, 'Fee details').click();
  await total(page, 630);
  await textVisible(region(page, 'Fee details'), 'Combo insurance: ¥40');
  await textVisible(region(page, 'Fee details'), 'Extra 10 kg: ¥60');
});

test('REQ-3.7: Remove only the deselected optional fee', async ({ page }) => {
  await openHome(page);
  await openBooking(page);
  await setChecked(checkbox(page, 'Combo insurance'));
  await setChecked(checkbox(page, 'Extra 10 kg'));
  await total(page, 630);
  await setChecked(checkbox(page, 'Combo insurance'), false);
  await button(page, 'Fee details').click();
  await total(page, 590);
  await textVisible(region(page, 'Fee details'), 'Extra 10 kg: ¥60');
  await expect(region(page, 'Fee details').getByText('Combo insurance: ¥40', { exact: true })).toHaveCount(0);
});
