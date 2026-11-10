// requirement: REQ-3.1
import { test } from '@playwright/test';
import { enter, login, collection } from './helpers';

test("REQ-3.1: Show personal dashboard regions", async ({ page }) => {
  await enter(page);
  await login(page, true);
  for (const name of ['My Recent Drafts', 'My Recently Viewed', 'My Most Viewed Favorites', 'Recently Updated Pages']) await collection(page, name).expectVisible();
});
