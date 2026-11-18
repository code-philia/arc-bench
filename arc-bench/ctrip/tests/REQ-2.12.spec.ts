// requirement: REQ-2.12
import { expect } from "@playwright/test";
import { test, dateText, tripDate, textToken, textVisible, openHome, openBooking, total } from "./helpers";

test('REQ-2.12: Book JD5162 Economy fare', async ({ page }) => {
  await openHome(page);
  await openBooking(page);
  await textVisible(page, textToken('JD5162'));
  for (const value of [/\bChengdu\b|成都/i, /\bGuangzhou\b|广州/i, new RegExp(dateText(tripDate(page, 2)))]) {
    await expect.poll(() => page.getByText(value, { exact: false }).filter({ visible: true }).count()).toBeGreaterThan(0);
  }
  await total(page, 530);
});
