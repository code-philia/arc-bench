// requirement: REQ-3.5
import { test, expect } from '@playwright/test';
import { home, nav, action, region, openProduct, expectAverageRating, DETAIL } from './helpers';

test("REQ-3.5: Read existing review", async ({ page }) => {
  await home(page);
  await openProduct(page, DETAIL);
  const reviews = region(page, 'Reviews');
  await reviews.scrollIntoViewIfNeeded();
  await expect(reviews).toContainText('Good fit', { useInnerText: true });
  await expectAverageRating(reviews);
});

test("REQ-3.5: Require sign-in before review", async ({ page }) => {
  await home(page);
  await openProduct(page, DETAIL);
  const reviews = region(page, 'Reviews');
  await reviews.scrollIntoViewIfNeeded();
  const before = await reviews.innerText();
  const prompt = region(page, 'Sign in required');
  await expect(prompt).toBeHidden();
  await action(reviews, 'Write your review').click();
  await expect(prompt).toBeVisible();
  await expect(prompt).toContainText(DETAIL);
  await expect(reviews).toHaveText(before, { useInnerText: true });
});

test("REQ-3.5: Require sign-in before wishlist", async ({ page }) => {
  await home(page);
  await openProduct(page, DETAIL);
  const prompt = region(page, 'Sign in required');
  await expect(prompt).toBeHidden();
  await action(page, 'Wishlist').click();
  await expect(prompt).toBeVisible();
  await expect(prompt).toContainText(DETAIL);
  await expect(action(nav(page), 'Sign in')).toBeVisible();
  await expect(action(nav(page), 'Sign out')).toHaveCount(0);
});
