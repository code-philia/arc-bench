// requirement: REQ-7.8
import { test, expect } from '@playwright/test';
import { home, action, wishlistPage, createWishlist, wishlist, field, inputForm, confirmDeletion } from './helpers';
import { wishlistInput } from './fixtures/data';

test("REQ-7.8: Rename Favorites wishlist", async ({ page }) => {
  await home(page);
  await wishlistPage(page);
  const original = wishlistInput();
  const renamed = wishlistInput();
  await createWishlist(page, original);
  await action(wishlist(page, original), 'Edit').click();
  const form = inputForm(page, ['Name'], 'Save');
  await expect(field(form, 'Name')).toHaveValue(original);
  await field(form, 'Name').fill(renamed);
  await action(form, 'Save').click();
  await expect(wishlist(page, renamed)).toHaveCount(1);
  await expect(wishlist(page, renamed)).toBeVisible();
  await expect(wishlist(page, original)).toHaveCount(0);
});

test("REQ-7.8: Delete Favorites wishlist", async ({ page }) => {
  await home(page);
  await wishlistPage(page);
  const name = wishlistInput();
  await createWishlist(page, name);
  const record = wishlist(page, name);
  await expect(record).toBeVisible();
  await confirmDeletion(page, action(record, 'Delete'));
  await expect(record).toHaveCount(0);
  await expect(action(page, 'Create new wishlist')).toBeVisible();
});
