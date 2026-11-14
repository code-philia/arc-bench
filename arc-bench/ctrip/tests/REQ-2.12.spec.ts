// requirement: REQ-2.12
import { expect } from "@playwright/test";
import { test, tripDate, heading, textVisible, openHome, openBooking, total } from "./helpers";

test('REQ-2.12: Book JD5162 Economy fare', async ({ page }) => {
  await openHome(page);
  await openBooking(page);
  await heading(page, 'Book flight');
  await textVisible(page, 'JD5162');
  for (const value of ['Chengdu', 'Guangzhou', tripDate(page, 2)]) {
    await expect.poll(() => page.getByText(value, { exact: false }).filter({ visible: true }).count()).toBeGreaterThan(0);
  }
  await total(page, 530);
});
