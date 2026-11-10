import { generateBookData, generateDraftData, generatePageData } from './fixtures/data';
// requirement: REQ-6.1
import { test } from '@playwright/test';
import { enter, home, login, heading, createBook, createPage, collection } from './helpers';

test("REQ-6.1: Publish a page", async ({ page }) => {
  await enter(page);
  const bookData = generateBookData({ prefix: 'Book 6.1.1' });
  const book = await createBook(page, bookData);
  const pageData = generatePageData({ prefix: 'Page Created 6.1.1', bookName: book });
  const name = await createPage(page, pageData);
  await heading(page, book);
  await collection(page, 'Page list', { owner: book }).item(name).expectCount(1);
});

test("REQ-6.1: Save an owned recent draft", async ({ page }) => {
  await enter(page);
  await login(page);
  const bookData = generateBookData({ prefix: 'Book 6.1.2' });
  const book = await createBook(page, bookData);
  const pageData = generateDraftData({ prefix: 'Page Draft 6.1.2', bookName: book });
  const draft = await createPage(page, pageData, true);
  await home(page);
  await collection(page, 'My Recent Drafts').item(draft).expectCount(1);
});
