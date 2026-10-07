// requirement: REQ-2.12
import { test, expect } from "@playwright/test";
import { flight, heading, textVisible, openHome, installClock, openBooking, total } from "./helpers";

test.beforeEach(async ({ page }) => { await installClock(page); });

test('REQ-2.12: Book JD5162 Economy fare', async ({ page }, testInfo) => {
  await openHome(page);
  await openBooking(page);
  await heading(page, 'Book flight');
  await textVisible(page, 'JD5162');
  for (const value of ['Chengdu', 'Guangzhou', '2026-07-21']) {
    await expect.poll(() => page.getByText(value, { exact: false }).filter({ visible: true }).count()).toBeGreaterThan(0);
  }
  await total(page, 530);
});

