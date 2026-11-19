import { generateBookData } from './fixtures/data';
// requirement: REQ-8.2
import { expect, test } from '@playwright/test';
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
      await action(page, 'Favourite').activate();
      await favorite(page).expectState(true);
    }
    await home(page);
    const favorites = collection(page, 'My Most Viewed Favourites');
    let visible: string[] = [];
    await expect.poll(async () => {
      visible = await favorites.displayedNames();
      return visible.length;
    }).toBeGreaterThan(0);
    // Verify an actual shortlist entry; historical favorites may outrank every
    // new object. Selecting one is not an instruction to mutate its preference.
    book = visible.sort()[0];
    await collection(page, 'My Most Viewed Favourites').item(book).expectCount(1);
    await collection(page, 'My Most Viewed Favourites').expectMaxItems(4);
    await collection(page, 'My Most Viewed Favourites').item(book).open();
    await heading(page, book);
  });
});
