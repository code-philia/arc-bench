// requirement: REQ-8.1
import { test, expect } from '@playwright/test';
import { identity, enter, region, entry, button, home, login, createBook } from './helpers';

test("REQ-8.1: Favorite a book", async ({ page }, testInfo) => {
  const id = identity(testInfo);
  await enter(page);
  await login(page);
  await createBook(page, id, 'Book 8.1');
  await expect(button(page, 'Favorite')).toHaveAttribute('aria-pressed', 'false');
  await button(page, 'Favorite').click();
  await expect(button(page, 'Unfavorite')).toHaveAttribute('aria-pressed', 'true');
});

test("REQ-8.1: Persist removal of a favorite", async ({ page }, testInfo) => {
  const id = identity(testInfo);
  await enter(page);
  await login(page);
  const book = await createBook(page, id, 'Book Unfavorite');
  await button(page, 'Favorite').click();
  await expect(button(page, 'Unfavorite')).toHaveAttribute('aria-pressed', 'true');
  await page.reload();
  await expect(button(page, 'Unfavorite')).toHaveAttribute('aria-pressed', 'true');
  await button(page, 'Unfavorite').click();
  await expect(button(page, 'Favorite')).toHaveAttribute('aria-pressed', 'false');
  await page.reload();
  await expect(button(page, 'Favorite')).toHaveAttribute('aria-pressed', 'false');
  await home(page);
  await expect(entry(region(page, 'My Most Viewed Favorites'), book)).toHaveCount(0);
});
