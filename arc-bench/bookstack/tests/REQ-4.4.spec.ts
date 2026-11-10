import { generateShelfData } from './fixtures/data';
// requirement: REQ-4.4
import { test } from '@playwright/test';
import { enter, heading, text, go, createShelf, openShelf, action, collection } from './helpers';

test("REQ-4.4: Confirm deletion", async ({ page }) => {
  await enter(page);
  const shelfData = generateShelfData({ prefix: 'Shelf 4.4.1' });
  const name = await createShelf(page, shelfData);
  await openShelf(page, name);
  await action(page, 'Delete').activate();
  await action(page, 'Confirm Delete').activate();
  await heading(page, 'Shelves');
  await page.reload();
  await go(page, 'Shelves');
  await collection(page, 'Shelf list').item(name).expectCount(0);
});

test("REQ-4.4: Cancel deletion", async ({ page }) => {
  await enter(page);
  const shelfData = generateShelfData({ prefix: 'Shelf 4.4.2' });
  const name = await createShelf(page, shelfData);
  await openShelf(page, name);
  await action(page, 'Delete').activate();
  await action(page, 'Cancel').activate();
  await heading(page, name);
  await text(page, shelfData.description, name);
});
