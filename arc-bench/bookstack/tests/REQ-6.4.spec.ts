import { generateBookData, generatePageData } from './fixtures/data';
// requirement: REQ-6.4
import { test } from '@playwright/test';
import { enter, heading, text, createBook, createPage, action, collection, pageEditor } from './helpers';

test("REQ-6.4: Read selected page", async ({ page }) => {
  await enter(page);
  const bookData = generateBookData({ prefix: 'Book 6.3.1' });
  const book = await createBook(page, bookData);
  const pageData = generatePageData({ prefix: 'Page 6.3.1', bookName: book });
  const name = await createPage(page, pageData);
  await collection(page, 'Page list', { owner: book }).item(name).open();
  await heading(page, name);
  await text(page, pageData.content, name);
});

test("REQ-6.4: Reopen page editor", async ({ page }) => {
  await enter(page);
  const bookData = generateBookData({ prefix: 'Book 6.3.2' });
  const book = await createBook(page, bookData);
  const pageData = generatePageData({ prefix: 'Page 6.3.2', bookName: book });
  const name = await createPage(page, pageData);
  await collection(page, 'Page list', { owner: book }).item(name).open();
  await action(page, 'Edit').activate();
  await pageEditor(page).title.expectValue(name);
  await pageEditor(page).body.expectValue(pageData.content);
  await action(page, 'Save Page').expectVisible();
});
