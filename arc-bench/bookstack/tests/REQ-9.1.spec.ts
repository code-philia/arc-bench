// requirement: REQ-9.1
import { test, expect } from '@playwright/test';
import { identity, enter, region, entry, home, heading, text, createBook, createPage } from './helpers';

test("REQ-9.1: Open recently published page", async ({ page }, testInfo) => {
  const id = identity(testInfo);
  await enter(page);
  const book = await createBook(page, id, 'Book 9.1');
  const name = await createPage(page, id, book, 'Page Updated 9.1', 'Page content created by corresponding prerequisite behavior.');
  await home(page);
  const collection = region(page, 'Recently Updated Pages');
  await entry(region(page, 'Recently Updated Pages'), name).click();
  await heading(page, name);
  await text(page, 'Page content created by corresponding prerequisite behavior.');
});
