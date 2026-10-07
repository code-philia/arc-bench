// requirement: REQ-4.5
import { test, expect } from '@playwright/test';
import { expectMetadata, identity, named, enter, button, heading, text, metadata, createShelf, openShelf } from './helpers';

test("REQ-4.5: Save metadata changes", async ({ page }, testInfo) => {
  const id = identity(testInfo);
  await enter(page);
  const original = await createShelf(page, id, 'Shelf 4.5.1', 'Reference shelf description.', 'knowledge-base, docs');
  await openShelf(page, original);
  await button(page, 'Edit').click();
  const updated = named(id, 'Shelf Updated 4.5.1');
  await metadata(page, updated, 'Shelf updated by corresponding prerequisite behavior.', 'knowledge-base, docs');
  await button(page, 'Save Shelf').click();
  await heading(page, updated);
  await text(page, 'Shelf updated by corresponding prerequisite behavior.');
  await page.reload();
  await heading(page, updated);
  await text(page, 'Shelf updated by corresponding prerequisite behavior.');
  await button(page, 'Edit').click();
});

test("REQ-4.5: Cancel metadata changes", async ({ page }, testInfo) => {
  const id = identity(testInfo);
  await enter(page);
  const original = await createShelf(page, id, 'Shelf 4.5.2', 'Reference shelf description.', 'knowledge-base, docs');
  await openShelf(page, original);
  await button(page, 'Edit').click();
  const updated = named(id, 'Shelf Updated 4.5.2');
  await metadata(page, updated, 'Shelf updated by corresponding prerequisite behavior.', 'knowledge-base, docs');
  await button(page, 'Cancel').click();
  await heading(page, original);
  await text(page, 'Reference shelf description.');
  await expect(page.getByRole('heading', { name: updated, exact: true })).toHaveCount(0);
});
