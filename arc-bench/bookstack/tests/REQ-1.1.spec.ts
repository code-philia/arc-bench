// requirement: REQ-1.1
import { test, expect } from '@playwright/test';
import { enter } from './helpers';

test("REQ-1.1: Show logged-out navigation", async ({ page }) => {
  await enter(page);
  for (const name of ['Login', 'Shelves', 'Books']) await expect(page.getByRole('link', { name, exact: true })).toBeVisible();
});
