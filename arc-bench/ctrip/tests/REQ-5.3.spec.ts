// requirement: REQ-5.3
import { expect } from "@playwright/test";
import { test, button, region, record, records, visible, textVisible, alertText, openHome, openCommon, createTraveler, travelerInput, registerAccount } from "./helpers";

test('REQ-5.3: Save traveler and retain masked identity', async ({ page }) => {
  await openHome(page);
  await registerAccount(page);
  await openCommon(page, undefined, 'Travelers');
  const name = travelerInput('Wang Wu');
  await createTraveler(page, name);
  await expect(records(region(page, 'Traveler list'))).toHaveCount(1);
  await textVisible(record(region(page, 'Traveler list'), name.name), name.maskedId);
  await page.reload();
  await textVisible(record(region(page, 'Traveler list'), name.name), name.maskedId);
});

test('REQ-5.3: Reject traveler without full name', async ({ page }) => {
  await openHome(page);
  await registerAccount(page);
  await openCommon(page, undefined, 'Travelers');
  const before = await records(region(page, 'Traveler list')).count();
  await button(page, 'Add traveler').click();
  await button(region(page, 'Add traveler'), 'Save traveler').click();
  await alertText(region(page, 'Add traveler'), 'Enter a full name');
  await visible(region(page, 'Add traveler'));
  await expect(records(region(page, 'Traveler list'))).toHaveCount(before);
});
