// requirement: REQ-4.4
import { test, expect } from '@playwright/test';
import { identity, enter, region, entry, button, heading, text, go, createShelf, openShelf } from './helpers';

test("REQ-4.4: Confirm deletion", async ({ page }, testInfo) => {
  const id = identity(testInfo);
  await enter(page);
  const name = await createShelf(page, id, 'Shelf 4.4.1', 'Reference shelf description.');
  await openShelf(page, name);
  await button(page, 'Delete').click();
  await button(page, 'Confirm Delete').click();
  await heading(page, 'Shelfs');
  await page.reload();
  await go(page, 'Shelves');
  await expect(entry(region(page, 'Shelf list'), name)).toHaveCount(0);
});

test("REQ-4.4: Cancel deletion", async ({ page }, testInfo) => {
  const id = identity(testInfo);
  await enter(page);
  const name = await createShelf(page, id, 'Shelf 4.4.2', 'Reference shelf description.');
  await openShelf(page, name);
  await button(page, 'Delete').click();
  await button(page, 'Cancel').click();
  await heading(page, name);
  await text(page, 'Reference shelf description.');
});
