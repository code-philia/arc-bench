import { generateBookData, generatePageData } from './fixtures/data';
// requirement: REQ-9.1
import { test } from '@playwright/test';
import { enter, home, heading, text, createBook, createPage, collection } from './helpers';

test("REQ-9.1: Open recently published page", async ({ page }) => {
  test.setTimeout(90_000);
  await enter(page);
  const bookData = generateBookData({ prefix: 'Book 9.1' });
  const book = await createBook(page, bookData);
  let name = '';
  let body = '';
  for (let i = 0; i < 6; i++) {
    const pageData = generatePageData({ prefix: 'Page Updated 9.1', bookName: book });
    name = await createPage(page, pageData);
    body = pageData.content;
  }
  await home(page);
  await collection(page, 'Recently Updated Pages').item(name).expectCount(1);
  await collection(page, 'Recently Updated Pages').expectMaxItems(5);
  await collection(page, 'Recently Updated Pages').item(name).open();
  await heading(page, name);
  await text(page, body, name);
});
