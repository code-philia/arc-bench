import { generateShelfData } from './fixtures/data';
// requirement: REQ-4.2
import { test } from '@playwright/test';
import { text, enter, heading, createShelf, openShelf } from './helpers';

test("REQ-4.2: Open from global list", async ({ page }) => {
  await enter(page);
  const shelfData = generateShelfData({ prefix: 'Shelf 4.2.1' });
  const name = await createShelf(page, shelfData);
  await openShelf(page, name);
  await heading(page, name);
  await text(page, shelfData.description, name);
});
