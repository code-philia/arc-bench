// requirement: REQ-9.2.1
import { expect } from '@playwright/test';
import { test } from './fixtures/test';
import { entry, guideCategories, guideCategory, guideDropdown, link, moreEntry } from './helpers';

test("REQ-9.2.1: Open travel-guide dropdown", async ({ page }) => {
  await entry(page);
  const dropdown = await guideDropdown(page);
  await expect(dropdown).toBeVisible();
  for (const name of guideCategories) await expect(link(guideCategory(page, dropdown, name), moreEntry)).toBeVisible();
});
