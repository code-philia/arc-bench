// requirement: REQ-5.1
import { test, expect } from '@playwright/test';
import { identity, enter, region, entry, go, createBook } from './helpers';

test("REQ-5.1: Show a uniquely identified item", async ({ page }, testInfo) => {
  const id = identity(testInfo);
  await enter(page);
  const name = await createBook(page, id, 'Book 5.1');
  await go(page, 'Books');
  await expect(entry(region(page, 'Book list'), name)).toHaveCount(1);
});
