import { generateBookData, generateDraftData } from './fixtures/data';
// requirement: REQ-6.2
import { test } from '@playwright/test';
import { enter, login, heading, createBook, openBook, createPage, action, collection } from './helpers';

test("REQ-6.2: Confirm draft deletion", async ({ page }) => {
  await enter(page);
  await login(page);
  const bookData = generateBookData({ prefix: 'Book 6.1.3' });
  const book = await createBook(page, bookData);
  const pageData = generateDraftData({ prefix: 'Draft 6.1.3', bookName: book });
  const draft = await createPage(page, pageData, true);
  await openBook(page, book);
  await collection(page, 'Page list', { owner: book }).item(draft).open();
  await action(page, 'Delete Draft').activate();
  await action(page, 'Confirm Delete').activate();
  await heading(page, book);
  await collection(page, 'Page list', { owner: book }).item(draft).expectCount(0);
});
