// requirement: REQ-7.8
import { expect } from "@playwright/test";
import { test, action, region, textVisible, openHome, openStatus, queryStatusNumber, registerAccount } from "./helpers";

test('REQ-7.8: Keep status search history private to its account', async ({ page }) => {
  await openHome(page);
  await registerAccount(page);
  await openStatus(page);
  await queryStatusNumber(page, 'JD5162');
  await openHome(page);
  await action(page, 'My account').hover();
  await action(page, 'Log out').click();
  await registerAccount(page);
  await openStatus(page);
  await expect(action(region(page, 'Search history'), 'JD5162')).toHaveCount(0);
  await textVisible(region(page, 'Search history'), 'No search history');
});
