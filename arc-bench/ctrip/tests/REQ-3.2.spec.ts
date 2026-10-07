// requirement: REQ-3.2
import { test, expect } from "@playwright/test";
import { region, checkbox, record, records, visible, textVisible, total, openHome, installClock, loginOwner, openBooking } from "./helpers";

test.beforeEach(async ({ page }) => { await installClock(page); });

test('REQ-3.2: Fill two passengers with corresponding total', async ({ page }, testInfo) => {
  await openHome(page);
  await loginOwner(page, 'user');
  await openBooking(page);
  await textVisible(region(page, 'Fee breakdown'), 'Passengers: 1');
  await total(page, 530);
  await checkbox(region(page, 'Frequent passengers'), 'Zhang San').check();
  await checkbox(region(page, 'Frequent passengers'), 'Li Si').check();
  await expect(records(region(page, 'Selected passengers'))).toHaveCount(2);
  await visible(record(region(page, 'Selected passengers'), 'Zhang San'));
  await visible(record(region(page, 'Selected passengers'), 'Li Si'));
  await textVisible(region(page, 'Fee breakdown'), 'Passengers: 2');
  await total(page, 1060);
});

