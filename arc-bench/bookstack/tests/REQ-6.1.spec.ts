// requirement: REQ-6.1
import { test, expect } from '@playwright/test';
import { identity, enter, region, entry, home, login, heading, createBook, createPage } from './helpers';

test("REQ-6.1: Publish a page", async ({ page }, testInfo) => {
  const id = identity(testInfo);
  await enter(page);
  const book = await createBook(page, id, 'Book 6.1.1');
  const name = await createPage(page, id, book, 'Page Created 6.1.1', 'Page content created by corresponding prerequisite behavior.');
  await heading(page, book);
  await expect(entry(region(page, 'Page list'), name)).toHaveCount(1);
});

test("REQ-6.1: Save an owned recent draft", async ({ page }, testInfo) => {
  const id = identity(testInfo);
  await enter(page);
  await login(page);
  const book = await createBook(page, id, 'Book 6.1.2');
  const draft = await createPage(page, id, book, 'Page Draft 6.1.2', 'Draft content created by corresponding prerequisite behavior.', true);
  await home(page);
  await expect(entry(region(page, 'My Recent Drafts'), draft)).toHaveCount(1);
});
