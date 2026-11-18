// requirement: REQ-1.5
import { test, expect } from '@playwright/test';
import { home, action, region, DETAIL } from './helpers';

test("REQ-1.5: Open popular t-shirt", async ({ page }) => {
  await home(page);
  await action(region(page, 'Popular Products'), DETAIL).click();
  await expect(page.getByRole('heading', { name: DETAIL, exact: true })).toBeVisible();
  await expect(action(page, 'Add to cart')).toBeVisible();
});
