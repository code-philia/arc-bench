import { generateBookData } from './fixtures/data';
// requirement: REQ-8.1
import { test } from '@playwright/test';
import { enter, home, login, createBook, action, collection, favorite, withFavoriteCleanup } from './helpers';

test("REQ-8.1: Favorite a book", async ({ page }) => {
  await enter(page);
  await login(page);
  await withFavoriteCleanup(page, async track => {
    const bookData = generateBookData({ prefix: 'Book 8.1' });
    const book = await createBook(page, bookData);
    track(book);
    await favorite(page).expectState(false);
    await action(page, 'Favorite').activate();
    await favorite(page).expectState(true);
  });
});

test("REQ-8.1: Persist removal of a favorite", async ({ page }) => {
  await enter(page);
  await login(page);
  await withFavoriteCleanup(page, async track => {
    const bookData = generateBookData({ prefix: 'Book Unfavorite' });
    const book = await createBook(page, bookData);
    track(book);
    await action(page, 'Favorite').activate();
    await favorite(page).expectState(true);
    await page.reload();
    await favorite(page).expectState(true);
    await action(page, 'Unfavorite').activate();
    await favorite(page).expectState(false);
    await page.reload();
    await favorite(page).expectState(false);
    await home(page);
    await collection(page, 'My Most Viewed Favorites').item(book).expectCount(0);
  });
});
