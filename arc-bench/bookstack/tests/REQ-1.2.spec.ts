// requirement: REQ-1.2
import { test } from '@playwright/test';
import { enter, go, home, collection, navigationAction } from './helpers';

test("REQ-1.2: Return from shelves", async ({ page }) => {
  await enter(page);
  await go(page, 'Shelves');
  await collection(page, 'Shelf list').expectVisible();
  await home(page);
  await navigationAction(page, 'Books').expectVisible();
});
