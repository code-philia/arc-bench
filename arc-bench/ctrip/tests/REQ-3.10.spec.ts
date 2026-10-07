// requirement: REQ-3.10
import { test, expect } from "@playwright/test";
import { region, checkbox, record, records, visible, textVisible, total, openHome, installClock, loginOwner, openBooking } from "./helpers";

test.beforeEach(async ({ page }) => { await installClock(page); });

test('REQ-3.10: Remove one selected frequent passenger', async ({ page }, testInfo) => {
  await openHome(page);
  await loginOwner(page, 'user');
  await openBooking(page);
  await checkbox(region(page, 'Frequent passengers'), 'Zhang San').check();
  await checkbox(region(page, 'Frequent passengers'), 'Li Si').check();
  await total(page, 1060);
  await checkbox(region(page, 'Frequent passengers'), 'Li Si').uncheck();
  await expect(records(region(page, 'Selected passengers'))).toHaveCount(1);
  await visible(record(region(page, 'Selected passengers'), 'Zhang San'));
  await expect(record(region(page, 'Selected passengers'), 'Li Si')).toHaveCount(0);
  await textVisible(region(page, 'Fee breakdown'), 'Passengers: 1');
  await total(page, 530);
});
