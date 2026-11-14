// requirement: REQ-5.2
import { expect } from "@playwright/test";
import { test, field, button, region, record, records, visible, textVisible, openHome, openCommon, registerAccount, travelerInput, createTraveler, uniqueName } from "./helpers";

test('REQ-5.2: Find matching traveler', async ({ page }) => {
  await openHome(page);
  await registerAccount(page);
  await openCommon(page, undefined, 'Travelers');
  const match = travelerInput('Matching traveler');
  await createTraveler(page, match);
  await createTraveler(page, travelerInput('Other traveler'));
  await field(page, 'Traveler name').fill(match.name);
  await button(page, 'Search travelers').click();
  await expect(records(region(page, 'Traveler list'))).toHaveCount(1);
  await visible(record(region(page, 'Traveler list'), match.name));
});

test('REQ-5.2: Show traveler search empty state', async ({ page }) => {
  await openHome(page);
  await registerAccount(page);
  await openCommon(page, undefined, 'Travelers');
  await createTraveler(page, travelerInput('Saved traveler'));
  await field(page, 'Traveler name').fill(uniqueName('Missing traveler'));
  await button(page, 'Search travelers').click();
  await expect(records(region(page, 'Traveler list'))).toHaveCount(0);
  await textVisible(region(page, 'Traveler list'), 'No travelers found');
});
