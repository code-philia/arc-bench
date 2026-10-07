// requirement: REQ-5.11
import { test, expect } from "@playwright/test";
import { button, region, dialog, checkbox, record, records, visible, openHome, installClock, isolatedName, openCommon, createAddress } from "./helpers";

test.beforeEach(async ({ page }) => { await installClock(page); });

test('REQ-5.11: Delete one address after confirmation', async ({ page }, testInfo) => {
  await openHome(page);
  await openCommon(page, 'address_delete', 'Addresses');
  const target = isolatedName('Address Delete A', testInfo);
  const keep = isolatedName('Address Keep A', testInfo);
  await createAddress(page, target);
  await createAddress(page, keep);
  await visible(record(region(page, 'Address list'), target));
  await button(record(region(page, 'Address list'), target), 'Delete').click();
  await visible(dialog(page, 'Delete address'));
  await visible(record(region(page, 'Address list'), target));
  await button(dialog(page, 'Delete address'), 'Confirm deletion').click();
  await expect(record(region(page, 'Address list'), target)).toHaveCount(0);
  await visible(record(region(page, 'Address list'), keep));
  await page.reload();
  await expect(record(region(page, 'Address list'), target)).toHaveCount(0);
  await visible(record(region(page, 'Address list'), keep));
});

test('REQ-5.11: Delete only selected address records', async ({ page }, testInfo) => {
  await openHome(page);
  await openCommon(page, 'address_batch', 'Addresses');
  const a = isolatedName('Address Batch A', testInfo);
  const b = isolatedName('Address Batch B', testInfo);
  const keep = isolatedName('Address Keep', testInfo);
  await createAddress(page, a);
  await createAddress(page, b);
  await createAddress(page, keep);
  await checkbox(region(page, 'Address list'), a).check();
  await checkbox(region(page, 'Address list'), b).check();
  await button(page, 'Delete selected').click();
  await button(dialog(page, 'Delete addresses'), 'Confirm deletion').click();
  await expect(record(region(page, 'Address list'), a)).toHaveCount(0);
  await expect(record(region(page, 'Address list'), b)).toHaveCount(0);
  await visible(record(region(page, 'Address list'), keep));
  await page.reload();
  await expect(record(region(page, 'Address list'), a)).toHaveCount(0);
  await expect(record(region(page, 'Address list'), b)).toHaveCount(0);
  await visible(record(region(page, 'Address list'), keep));
});

