// requirement: REQ-4.2
import { test } from '@playwright/test';
import { text, identity, enter, heading, createShelf, openShelf } from './helpers';

test("REQ-4.2: Open from global list", async ({ page }, testInfo) => {
  const id = identity(testInfo);
  await enter(page);
  const name = await createShelf(page, id, 'Shelf 4.2.1');
  await openShelf(page, name);
  await heading(page, name);
  await text(page, 'Reference shelf description.');
});
