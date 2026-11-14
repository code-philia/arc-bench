// requirement: REQ-9.2.1
import { expect } from '@playwright/test';
import { test } from './fixtures/test';
import { entry, link, openMenu, region } from './helpers';

test("REQ-9.2.1: Open travel-guide dropdown", async ({ page }) => {
  await entry(page);
  await openMenu(link(page.getByRole('navigation'), 'Travel guide'), region(page, 'Travel guide categories'));
  const dropdown = region(page, 'Travel guide categories');
  await expect(dropdown).toBeVisible();
  for (const name of ['Ticketing', 'Endorsement and refund', 'Miscellaneous']) await expect(link(region(dropdown, name), 'More')).toBeVisible();
});
