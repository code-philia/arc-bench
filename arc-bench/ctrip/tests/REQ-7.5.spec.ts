// requirement: REQ-7.5
import { expect } from "@playwright/test";
import { test, button, action, region, visible, textVisible, openHome, openStatus, queryStatusNumber, registerAccount } from "./helpers";

test('REQ-7.5: Clear account search history', async ({ page }) => {
  await openHome(page);
  await registerAccount(page);
  await openStatus(page);
  await queryStatusNumber(page, 'MU5234');
  await openStatus(page);
  await visible(action(region(page, 'Search history'), 'MU5234'));
  await button(region(page, 'Search history'), 'Clear history').click();
  await expect(action(region(page, 'Search history'), 'MU5234')).toHaveCount(0);
  await textVisible(region(page, 'Search history'), 'No search history');
  await page.reload();
  await expect(action(region(page, 'Search history'), 'MU5234')).toHaveCount(0);
  await textVisible(region(page, 'Search history'), 'No search history');
});
