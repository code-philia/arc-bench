// requirement: REQ-5.5
import { test, expect } from '@playwright/test';
import { identity, enter, region, entry, button, heading, text, go, createBook, openBook } from './helpers';

test("REQ-5.5: Confirm deletion", async ({ page }, testInfo) => {
  const id = identity(testInfo);
  await enter(page);
  const name = await createBook(page, id, 'Book 5.5.1', 'Reference book description.');
  await openBook(page, name);
  await button(page, 'Delete').click();
  await button(page, 'Confirm Delete').click();
  await heading(page, 'Books');
  await page.reload();
  await go(page, 'Books');
  await expect(entry(region(page, 'Book list'), name)).toHaveCount(0);
});

test("REQ-5.5: Cancel deletion", async ({ page }, testInfo) => {
  const id = identity(testInfo);
  await enter(page);
  const name = await createBook(page, id, 'Book 5.5.2', 'Reference book description.');
  await openBook(page, name);
  await button(page, 'Delete').click();
  await button(page, 'Cancel').click();
  await heading(page, name);
  await text(page, 'Reference book description.');
});
