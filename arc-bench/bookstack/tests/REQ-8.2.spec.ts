import { generateBookData } from './fixtures/data';
// requirement: REQ-8.2
import { test } from '@playwright/test';
import { enter, home, login, heading, createBook, action, collection, favorite, withFavoriteCleanup } from './helpers';

test("REQ-8.2: Open favorited book", async ({ page }) => {
  test.setTimeout(90_000);
  await enter(page);
  await login(page);
  await withFavoriteCleanup(page, async track => {
    let book = '';
    for (let i = 0; i < 5; i++) {
      const bookData = generateBookData({ prefix: 'Book 8.2' });
      book = await createBook(page, bookData);
      track(book);
      await action(page, 'Favorite').activate();
      await favorite(page).expectState(true);
    }
    await home(page);
    await collection(page, 'My Most Viewed Favorites').item(book).expectCount(1);
    await collection(page, 'My Most Viewed Favorites').expectMaxItems(4);
    await collection(page, 'My Most Viewed Favorites').item(book).open();
    await heading(page, book);
  });
});
