// requirement: REQ-4.3
import { test, expect } from '@playwright/test';
import { expectMetadata, identity, named, enter, region, entry, button, heading, metadata, beginShelf, createShelf } from './helpers';

test("REQ-4.3: Save a new shelf", async ({ page }, testInfo) => {
  const id = identity(testInfo);
  await enter(page);
  const name = await createShelf(page, id, 'Shelf Created 4.3.1', 'Shelf created by corresponding prerequisite behavior.', 'created, shelf');
  await expect(entry(region(page, 'Shelf list'), name)).toHaveCount(1);
  await entry(region(page, 'Shelf list'), name).click();
  await page.reload();
  await button(page, 'Edit').click();
});

test("REQ-4.3: Cancel new shelf", async ({ page }, testInfo) => {
  const id = identity(testInfo);
  await enter(page);
  await beginShelf(page);
  const name = named(id, 'Shelf Cancelled 4.3.2');
  await metadata(page, name, 'Unsaved shelf description 4.3.2.', 'cancelled, shelf');
  await button(page, 'Cancel').click();
  await heading(page, 'Shelfs');
  await expect(entry(region(page, 'Shelf list'), name)).toHaveCount(0);
});
