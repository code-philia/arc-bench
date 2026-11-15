import { generateBookData } from './fixtures/data';
// requirement: REQ-5.1
import { test } from '@playwright/test';
import { enter, go, createBook, collection, heading, text } from './helpers';

test("REQ-5.1: Show a uniquely identified item", async ({ page }) => {
  await enter(page);
  const bookData = generateBookData({ prefix: 'Book 5.1' });
  const name = await createBook(page, bookData);
  await go(page, 'Books');
  await collection(page, 'Book list').item(name).expectCount(1);
  await collection(page, 'Book list').item(name).openWithKeyboard();
  await heading(page, name);
  await text(page, bookData.description, name);
});
