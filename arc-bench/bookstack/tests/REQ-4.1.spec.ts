// requirement: REQ-4.1
import { test, expect } from '@playwright/test';
import { identity, enter, region, entry, go, createShelf } from './helpers';

test("REQ-4.1: Show a uniquely identified item", async ({ page }, testInfo) => {
  const id = identity(testInfo);
  await enter(page);
  const name = await createShelf(page, id, 'Shelf 4.1');
  await go(page, 'Shelves');
  await expect(entry(region(page, 'Shelf list'), name)).toHaveCount(1);
});
