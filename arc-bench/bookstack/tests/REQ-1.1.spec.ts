// requirement: REQ-1.1
import { test } from '@playwright/test';
import { enter, navigationAction } from './helpers';

test("REQ-1.1: Show logged-out navigation", async ({ page }) => {
  await enter(page);
  for (const name of ['Login', 'Shelves', 'Books']) await navigationAction(page, name).expectVisible();
});
