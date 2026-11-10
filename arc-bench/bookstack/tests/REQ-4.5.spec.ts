import { generateShelfData } from './fixtures/data';
// requirement: REQ-4.5
import { test } from '@playwright/test';
import { expectMetadata, enter, heading, text, metadata, createShelf, openShelf, action, detailContent } from './helpers';

test("REQ-4.5: Save metadata changes", async ({ page }) => {
  await enter(page);
  const shelfData = generateShelfData({ prefix: 'Shelf 4.5.1' });
  const original = await createShelf(page, shelfData);
  await openShelf(page, original);
  await action(page, 'Edit').activate();
  await expectMetadata(page, original, shelfData.description, shelfData.tags);
  const updatedData = generateShelfData({ prefix: 'Shelf Updated 4.5.1' });
  const updated = updatedData.name;
  await metadata(page, updated, updatedData.description, shelfData.tags);
  await action(page, 'Save Shelf').activate();
  await heading(page, updated);
  await text(page, updatedData.description, updated);
  await page.reload();
  await heading(page, updated);
  await text(page, updatedData.description, updated);
  await action(page, 'Edit').activate();
  await expectMetadata(page, updated, updatedData.description, shelfData.tags);
});

test("REQ-4.5: Cancel metadata changes", async ({ page }) => {
  await enter(page);
  const shelfData = generateShelfData({ prefix: 'Shelf 4.5.2' });
  const original = await createShelf(page, shelfData);
  await openShelf(page, original);
  await action(page, 'Edit').activate();
  await expectMetadata(page, original, shelfData.description, shelfData.tags);
  const updatedData = generateShelfData({ prefix: 'Shelf Updated 4.5.2' });
  const updated = updatedData.name;
  await metadata(page, updated, updatedData.description, shelfData.tags);
  await action(page, 'Cancel').activate();
  await heading(page, original);
  await text(page, shelfData.description, original);
  await detailContent(page, original, updated).expectAbsent();
  await action(page, 'Edit').activate();
  await expectMetadata(page, original, shelfData.description, shelfData.tags);
});
