// requirement: REQ-3.1
import { test, expect } from '@playwright/test';
import { identity, enter, region, login } from './helpers';

test("REQ-3.1: Show personal dashboard regions", async ({ page }, testInfo) => {
  const id = identity(testInfo);
  await enter(page);
  await login(page, true);
  for (const name of ['My Recent Drafts', 'My Recently Viewed', 'My Most Viewed Favorites', 'Recently Updated Pages']) await expect(region(page, name)).toBeVisible();
});
