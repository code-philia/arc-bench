// requirement: REQ-6.2
import { test, expect } from '@playwright/test';
import { identity, enter, region, entry, button, login, heading, createBook, openBook, createPage } from './helpers';

test("REQ-6.2: Confirm draft deletion", async ({ page }, testInfo) => {
  const id = identity(testInfo);
  await enter(page);
  await login(page);
  const book = await createBook(page, id, 'Book 6.1.3');
  const draft = await createPage(page, id, book, 'Draft 6.1.3', 'Disposable draft.', true);
  await openBook(page, book);
  await entry(region(page, 'Page list'), draft).click();
  await button(page, 'Delete Draft').click();
  await button(page, 'Confirm Delete').click();
  await heading(page, book);
  await expect(entry(region(page, 'Page list'), draft)).toHaveCount(0);
});
