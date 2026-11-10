import { generateShelfData } from './fixtures/data';
// requirement: REQ-4.1
import { test } from '@playwright/test';
import { enter, go, createShelf, collection } from './helpers';

test("REQ-4.1: Show a uniquely identified item", async ({ page }) => {
  await enter(page);
  const shelfData = generateShelfData({ prefix: 'Shelf 4.1' });
  const name = await createShelf(page, shelfData);
  await go(page, 'Shelves');
  await collection(page, 'Shelf list').item(name).expectCount(1);
});
