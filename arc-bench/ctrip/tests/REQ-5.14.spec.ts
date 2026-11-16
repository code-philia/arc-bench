// requirement: REQ-5.14
import { expect } from "@playwright/test";
import { test, expectFieldValue, field, button, region, record, records, textVisible, openHome, openCommon, createTraveler, uniqueName, travelerInput, registerAccount } from "./helpers";

test('REQ-5.14: Edit a saved traveler name', async ({ page }) => {
  await openHome(page);
  await registerAccount(page);
  await openCommon(page, undefined, 'Travelers');
  const original = travelerInput('Original Traveler');
  const updated = uniqueName('Updated Traveler');
  await createTraveler(page, original);
  const before = await records(region(page, 'Traveler list')).count();
  await button(record(region(page, 'Traveler list'), original.name), 'Edit').click();
  await expectFieldValue(field(region(page, 'Edit traveler'), 'ID number'), original.id);
  await expectFieldValue(field(region(page, 'Edit traveler'), 'Full name'), original.name);
  await field(region(page, 'Edit traveler'), 'Full name').fill(updated);
  await button(region(page, 'Edit traveler'), 'Save traveler').click();
  await expect(record(region(page, 'Traveler list'), original.name)).toHaveCount(0);
  await textVisible(record(region(page, 'Traveler list'), updated), original.maskedId);
  await expect(records(region(page, 'Traveler list'))).toHaveCount(before);
  await page.reload();
  await expect(record(region(page, 'Traveler list'), original.name)).toHaveCount(0);
  await textVisible(record(region(page, 'Traveler list'), updated), original.maskedId);
  await expect(records(region(page, 'Traveler list'))).toHaveCount(before);
});
