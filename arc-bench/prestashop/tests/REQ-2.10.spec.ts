// requirement: REQ-2.10
import { test } from '@playwright/test';
import { home, men, verifyCombinedFilters } from './helpers';
import { storefrontInput } from './fixtures/data';

test("REQ-2.10: Combine filters and clear them", async ({ page }) => {
  await home(page);
  await men(page);
  await verifyCombinedFilters(page, storefrontInput().higherMinimum);
});
