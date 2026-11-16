// requirement: REQ-5.10
import { expect } from "@playwright/test";
import { test, setChecked, button, region, dialog, record, visible, openHome, openCommon, createTraveler, travelerInput, registerAccount, recordCheckbox } from "./helpers";

test('REQ-5.10: Delete one traveler after confirmation', async ({ page }) => {
  await openHome(page);
  await registerAccount(page);
  await openCommon(page, undefined, 'Travelers');
  const target = travelerInput('Traveler Delete A');
  const keep = travelerInput('Traveler Keep A');
  await createTraveler(page, target);
  await createTraveler(page, keep);
  await visible(record(region(page, 'Traveler list'), target.name));
  await button(record(region(page, 'Traveler list'), target.name), 'Delete').click();
  await visible(dialog(page, 'Delete traveler'));
  await visible(record(region(page, 'Traveler list'), target.name));
  await button(dialog(page, 'Delete traveler'), 'Confirm deletion').click();
  await expect(record(region(page, 'Traveler list'), target.name)).toHaveCount(0);
  await visible(record(region(page, 'Traveler list'), keep.name));
  await page.reload();
  await expect(record(region(page, 'Traveler list'), target.name)).toHaveCount(0);
  await visible(record(region(page, 'Traveler list'), keep.name));
});

test('REQ-5.10: Delete only selected traveler records', async ({ page }) => {
  await openHome(page);
  await registerAccount(page);
  await openCommon(page, undefined, 'Travelers');
  const a = travelerInput('Traveler Batch A');
  const b = travelerInput('Traveler Batch B');
  const keep = travelerInput('Traveler Keep');
  await createTraveler(page, a);
  await createTraveler(page, b);
  await createTraveler(page, keep);
  await setChecked(recordCheckbox(region(page, 'Traveler list'), a.name));
  await setChecked(recordCheckbox(region(page, 'Traveler list'), b.name));
  await button(page, 'Delete selected').click();
  await button(dialog(page, 'Delete travelers'), 'Confirm deletion').click();
  await expect(record(region(page, 'Traveler list'), a.name)).toHaveCount(0);
  await expect(record(region(page, 'Traveler list'), b.name)).toHaveCount(0);
  await visible(record(region(page, 'Traveler list'), keep.name));
  await page.reload();
  await expect(record(region(page, 'Traveler list'), a.name)).toHaveCount(0);
  await expect(record(region(page, 'Traveler list'), b.name)).toHaveCount(0);
  await visible(record(region(page, 'Traveler list'), keep.name));
});
