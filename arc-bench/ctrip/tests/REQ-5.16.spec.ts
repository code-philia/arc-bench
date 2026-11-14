// requirement: REQ-5.16
import { expect } from "@playwright/test";
import { test, field, button, region, record, records, textVisible, openHome, openCommon, createTraveler, travelerInput, registerAccount } from "./helpers";

test('REQ-5.16: Find a traveler created in the current session', async ({ page }) => {
  await openHome(page);
  await registerAccount(page);
  await openCommon(page, undefined, 'Travelers');
  const name = travelerInput('Search New Traveler');
  await createTraveler(page, name);
  await field(page, 'Traveler name').fill(name.name);
  await button(page, 'Search travelers').click();
  await expect(records(region(page, 'Traveler list'))).toHaveCount(1);
  await textVisible(record(region(page, 'Traveler list'), name.name), name.maskedId);
});
