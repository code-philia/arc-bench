// requirement: REQ-5.6
import { test, expect } from '@playwright/test';
import { identity, enter, region, entry, heading, createShelf, createShelfBook } from './helpers';

test("REQ-5.6: Save a book with shelf association", async ({ page }, testInfo) => {
  const id = identity(testInfo);
  await enter(page);
  const shelf = await createShelf(page, id, 'Shelf 5.6.1');
  const book = await createShelfBook(page, id, shelf, 'Book Created 5.6.1');
  await heading(page, book);
  await entry(page, shelf).click();
  await heading(page, shelf);
  await expect(entry(region(page, 'Book list'), book)).toBeVisible();
});
