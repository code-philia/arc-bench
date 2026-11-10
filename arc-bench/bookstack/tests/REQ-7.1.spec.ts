import { generateShelfData } from './fixtures/data';
// requirement: REQ-7.1
import { test } from '@playwright/test';
import { enter, home, login, heading, createShelf, openShelf, collection } from './helpers';

test("REQ-7.1: Record shelf visit", async ({ page }) => {
  test.setTimeout(90_000);
  await enter(page);
  await login(page);
  let shelf = '';
  // Exceed the existing ten-record rule without relying on historical account data.
  for (let i = 0; i < 11; i++) {
    const shelfData = generateShelfData({ prefix: 'Shelf 7.1' });
    shelf = await createShelf(page, shelfData);
    await openShelf(page, shelf);
  }
  await home(page);
  await collection(page, 'My Recently Viewed').item(shelf).expectCount(1);
  await collection(page, 'My Recently Viewed').expectMaxItems(10);
});

test("REQ-7.1: Reopen visited shelf", async ({ page }) => {
  await enter(page);
  await login(page);
  const shelfData = generateShelfData({ prefix: 'Shelf 7.2' });
  const shelf = await createShelf(page, shelfData);
  await openShelf(page, shelf);
  await home(page);
  await collection(page, 'My Recently Viewed').item(shelf).expectCount(1);
  await collection(page, 'My Recently Viewed').expectMaxItems(10);
  await collection(page, 'My Recently Viewed').item(shelf).open();
  await heading(page, shelf);
});
