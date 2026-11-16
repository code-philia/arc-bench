// requirement: REQ-5.11
import { expect } from "@playwright/test";
import { test, setChecked, button, region, dialog, record, visible, openHome, openCommon, createAddress, addressInput, registerAccount, recordCheckbox } from "./helpers";

test('REQ-5.11: Delete one address after confirmation', async ({ page }) => {
  await openHome(page);
  await registerAccount(page);
  await openCommon(page, undefined, 'Addresses');
  const target = addressInput('Address Delete A');
  const keep = addressInput('Address Keep A');
  await createAddress(page, target);
  await createAddress(page, keep);
  await visible(record(region(page, 'Address list'), target.name));
  await button(record(region(page, 'Address list'), target.name), 'Delete').click();
  await visible(dialog(page, 'Delete address'));
  await visible(record(region(page, 'Address list'), target.name));
  await button(dialog(page, 'Delete address'), 'Confirm deletion').click();
  await expect(record(region(page, 'Address list'), target.name)).toHaveCount(0);
  await visible(record(region(page, 'Address list'), keep.name));
  await page.reload();
  await expect(record(region(page, 'Address list'), target.name)).toHaveCount(0);
  await visible(record(region(page, 'Address list'), keep.name));
});

test('REQ-5.11: Delete only selected address records', async ({ page }) => {
  await openHome(page);
  await registerAccount(page);
  await openCommon(page, undefined, 'Addresses');
  const a = addressInput('Address Batch A');
  const b = addressInput('Address Batch B');
  const keep = addressInput('Address Keep');
  await createAddress(page, a);
  await createAddress(page, b);
  await createAddress(page, keep);
  await setChecked(recordCheckbox(region(page, 'Address list'), a.name));
  await setChecked(recordCheckbox(region(page, 'Address list'), b.name));
  await button(page, 'Delete selected').click();
  await button(dialog(page, 'Delete addresses'), 'Confirm deletion').click();
  await expect(record(region(page, 'Address list'), a.name)).toHaveCount(0);
  await expect(record(region(page, 'Address list'), b.name)).toHaveCount(0);
  await visible(record(region(page, 'Address list'), keep.name));
  await page.reload();
  await expect(record(region(page, 'Address list'), a.name)).toHaveCount(0);
  await expect(record(region(page, 'Address list'), b.name)).toHaveCount(0);
  await visible(record(region(page, 'Address list'), keep.name));
});
