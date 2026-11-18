// requirement: REQ-1.3
import { test, expect } from '@playwright/test';
import { home, nav, region, card, field, DETAIL } from './helpers';
import { storefrontInput } from './fixtures/data';

test("REQ-1.3: Suggest and search shirt", async ({ page }) => {
  await home(page);
  const search = field(nav(page), 'Search');
  await search.focus();
  await expect(search).toBeFocused();
  await search.fill(storefrontInput().search);
  const suggestions = region(page, 'Search suggestions');
  await expect(suggestions.getByText(DETAIL, { exact: true })).toBeVisible();
  await search.press('Enter');
  await expect(card(page, DETAIL)).toBeVisible();
});
