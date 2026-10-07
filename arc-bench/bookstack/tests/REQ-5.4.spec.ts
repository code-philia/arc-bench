// requirement: REQ-5.4
import { test, expect } from '@playwright/test';
import { expectMetadata, identity, named, enter, button, heading, text, metadata, createBook, openBook } from './helpers';

test("REQ-5.4: Save metadata changes", async ({ page }, testInfo) => {
  const id = identity(testInfo);
  await enter(page);
  const original = await createBook(page, id, 'Book 5.4.1', 'Reference book description.', 'manual, handbook');
  await openBook(page, original);
  await button(page, 'Edit').click();
  const updated = named(id, 'Book Updated 5.4.1');
  await metadata(page, updated, 'Book updated by corresponding prerequisite behavior.', 'manual, handbook');
  await button(page, 'Save Book').click();
  await heading(page, updated);
  await text(page, 'Book updated by corresponding prerequisite behavior.');
  await page.reload();
  await heading(page, updated);
  await text(page, 'Book updated by corresponding prerequisite behavior.');
  await button(page, 'Edit').click();
});

test("REQ-5.4: Cancel metadata changes", async ({ page }, testInfo) => {
  const id = identity(testInfo);
  await enter(page);
  const original = await createBook(page, id, 'Book 5.4.2', 'Reference book description.', 'manual, handbook');
  await openBook(page, original);
  await button(page, 'Edit').click();
  const updated = named(id, 'Book Updated 5.4.2');
  await metadata(page, updated, 'Book updated by corresponding prerequisite behavior.', 'manual, handbook');
  await button(page, 'Cancel').click();
  await heading(page, original);
  await text(page, 'Reference book description.');
  await expect(page.getByRole('heading', { name: updated, exact: true })).toHaveCount(0);
});
