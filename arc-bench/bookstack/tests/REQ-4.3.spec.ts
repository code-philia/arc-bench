import { generateShelfData } from './fixtures/data';
// requirement: REQ-4.3
import { test } from '@playwright/test';
import { expectMetadata, enter, heading, metadata, beginShelf, createShelf, action, collection } from './helpers';

test("REQ-4.3: Save a new shelf", async ({ page }) => {
  await enter(page);
  const shelfData = generateShelfData({ prefix: 'Shelf Created 4.3.1' });
  const name = await createShelf(page, shelfData);
  await collection(page, 'Shelf list').item(name).expectCount(1);
  await collection(page, 'Shelf list').item(name).open();
  await page.reload();
  await action(page, 'Edit').activate();
  await expectMetadata(page, name, shelfData.description, shelfData.tags);
});

test("REQ-4.3: Cancel new shelf", async ({ page }) => {
  await enter(page);
  await beginShelf(page);
  const newData = generateShelfData({ prefix: 'Shelf Cancelled 4.3.2' });
  const name = newData.name;
  await metadata(page, name, newData.description, newData.tags);
  await action(page, 'Cancel').activate();
  await heading(page, 'Shelves');
  await collection(page, 'Shelf list').item(name).expectCount(0);
});
