// requirement: REQ-7.1
import { test, expect } from '@playwright/test';
import { identity, enter, region, entry, home, login, heading, createShelf, openShelf } from './helpers';

test("REQ-7.1: Record shelf visit", async ({ page }, testInfo) => {
  const id = identity(testInfo);
  await enter(page);
  await login(page);
  const shelf = await createShelf(page, id, 'Shelf 7.1');
  await openShelf(page, shelf);
  await home(page);
  const collection = region(page, 'My Recently Viewed');
  await expect(entry(region(page, 'My Recently Viewed'), shelf)).toHaveCount(1);
});

test("REQ-7.1: Reopen visited shelf", async ({ page }, testInfo) => {
  const id = identity(testInfo);
  await enter(page);
  await login(page);
  const shelf = await createShelf(page, id, 'Shelf 7.2');
  await openShelf(page, shelf);
  await home(page);
  const collection = region(page, 'My Recently Viewed');
  await expect(entry(region(page, 'My Recently Viewed'), shelf)).toHaveCount(1);
  await entry(region(page, 'My Recently Viewed'), shelf).click();
  await heading(page, shelf);
});
