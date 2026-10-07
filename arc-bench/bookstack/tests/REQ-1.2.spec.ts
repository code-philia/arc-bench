// requirement: REQ-1.2
import { test, expect } from '@playwright/test';
import { enter, region, go, home } from './helpers';

test("REQ-1.2: Return from shelves", async ({ page }) => {
  await enter(page);
  await go(page, 'Shelves');
  await expect(region(page, 'Shelf list')).toBeVisible();
  await home(page);
  await expect(page.getByRole('link', { name: 'Books', exact: true })).toBeVisible();
});
