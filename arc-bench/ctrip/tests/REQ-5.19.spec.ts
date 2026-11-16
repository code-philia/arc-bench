// requirement: REQ-5.19
import { expect } from "@playwright/test";
import { test, button, region, dialog, record, records, textVisible, openHome, openCommon, createTraveler, travelerInput, registerAccount } from "./helpers";

test('REQ-5.19: Keep a traveler when deletion is declined', async ({ page }) => {
  await openHome(page);
  await registerAccount(page);
  await openCommon(page, undefined, 'Travelers');
  const name = travelerInput('Keep Declined Traveler');
  await createTraveler(page, name);
  const before = await records(region(page, 'Traveler list')).count();
  await button(record(region(page, 'Traveler list'), name.name), 'Delete').click();
  await button(dialog(page, 'Delete traveler'), 'Keep traveler').click();
  await expect(dialog(page, 'Delete traveler')).toHaveCount(0);
  await textVisible(record(region(page, 'Traveler list'), name.name), name.maskedId);
  await expect(records(region(page, 'Traveler list'))).toHaveCount(before);
  await page.reload();
  await textVisible(record(region(page, 'Traveler list'), name.name), name.maskedId);
  await expect(records(region(page, 'Traveler list'))).toHaveCount(before);
});
