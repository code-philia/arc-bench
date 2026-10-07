// requirement: REQ-8.2
import { test, expect } from '@playwright/test';
import { identity, enter, region, entry, button, home, login, heading, createBook } from './helpers';

test("REQ-8.2: Open favorited book", async ({ page }, testInfo) => {
  const id = identity(testInfo);
  await enter(page);
  await login(page);
  const book = await createBook(page, id, 'Book 8.2');
  await button(page, 'Favorite').click();
  await expect(button(page, 'Unfavorite')).toHaveAttribute('aria-pressed', 'true');
  await home(page);
  const collection = region(page, 'My Most Viewed Favorites');
  await entry(region(page, 'My Most Viewed Favorites'), book).click();
  await heading(page, book);
});
