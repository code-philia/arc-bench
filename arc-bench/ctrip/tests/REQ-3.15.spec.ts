// requirement: REQ-3.15
import { expect } from "@playwright/test";
import { test, setChecked, button, region, checkbox, total, openHome, openBooking, optionalFee, visible } from "./helpers";

test('REQ-3.15: Remove airport lounge service', async ({ page }) => {
  await openHome(page);
  await openBooking(page);
  await setChecked(checkbox(region(page, 'Airport services'), 'Tianfu T2 lounge'));
  await total(page, 610);
  await setChecked(checkbox(region(page, 'Airport services'), 'Tianfu T2 lounge'), false);
  await expect(checkbox(region(page, 'Airport services'), 'Tianfu T2 lounge')).not.toBeChecked();
  await total(page, 530);
  await button(page, 'Fee details').click();
  await expect(optionalFee(region(page, 'Fee details'), 'Tianfu T2 lounge', 80)).toHaveCount(0);
});
