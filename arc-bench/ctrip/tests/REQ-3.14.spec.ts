// requirement: REQ-3.14
import { expect } from "@playwright/test";
import { test, setChecked, field, button, region, checkbox, total, openHome, openBooking } from "./helpers";

test('REQ-3.14: Remove airport drop-off reservation', async ({ page }) => {
  await openHome(page);
  await openBooking(page);
  await field(region(page, 'Airport transfer'), 'Pickup address').fill('No. 1 Tianfu Avenue, Chengdu');
  await setChecked(checkbox(region(page, 'Airport transfer'), 'Airport drop-off'));
  await total(page, 572);
  await setChecked(checkbox(region(page, 'Airport transfer'), 'Airport drop-off'), false);
  await expect(checkbox(region(page, 'Airport transfer'), 'Airport drop-off')).not.toBeChecked();
  await total(page, 530);
  await button(page, 'Fee details').click();
  await expect(region(page, 'Fee details').getByText('Airport drop-off: ¥42', { exact: true })).toHaveCount(0);
});
