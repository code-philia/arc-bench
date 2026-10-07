// requirement: REQ-5.2
import { test } from '@playwright/test';
import { text, identity, enter, region, entry, heading, createShelf, createBook, openBook, createShelfBook } from './helpers';

test("REQ-5.2: Open from global list", async ({ page }, testInfo) => {
  const id = identity(testInfo);
  await enter(page);
  const name = await createBook(page, id, 'Book 5.2.1');
  await openBook(page, name);
  await heading(page, name);
  await text(page, 'Reference book description.');
});

test("REQ-5.2: Open from containing shelf", async ({ page }, testInfo) => {
  const id = identity(testInfo);
  await enter(page);
  const shelf = await createShelf(page, id, 'Shelf 5.2.2');
  const book = await createShelfBook(page, id, shelf, 'Book 5.2.2');
  await entry(page, shelf).click();
  await entry(region(page, 'Book list'), book).click();
  await heading(page, book);
  await text(page, 'Book created by corresponding prerequisite behavior.');
});
