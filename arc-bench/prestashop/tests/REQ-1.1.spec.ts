// requirement: REQ-1.1
import { test, expect } from '@playwright/test';
import { home, nav, action, region, tabTo, DETAIL, field, selectField } from './helpers';

test("REQ-1.1: Discover homepage", async ({ page }) => {
  await home(page);
  for (const name of ['Logo', 'CLOTHES', 'Sign in', 'Cart']) await expect(action(nav(page), name)).toBeVisible();
  await expect(field(nav(page), 'Search')).toBeVisible();
  await expect(selectField(nav(page), 'Language')).toBeVisible();
  await expect(action(nav(page), 'Cart')).toContainText('0');
  for (const name of ['Carousel', 'Popular Products', 'Promotions', 'Newsletter']) await expect(region(page, name)).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Popular Products', exact: true })).toBeVisible();
  await expect(action(region(page, 'Popular Products'), DETAIL)).toBeVisible();
  await expect(page.getByRole('contentinfo')).toBeVisible();
});

test("REQ-1.1: Use responsive keyboard navigation", async ({ page }) => {
  await home(page);
  const controls = [action(nav(page), 'Logo'), action(nav(page), 'CLOTHES'), field(nav(page), 'Search'), selectField(nav(page), 'Language'), action(nav(page), 'Sign in'), action(nav(page), 'Cart')];
  for (const control of controls) await tabTo(page, control);
  await page.setViewportSize({ width: 390, height: 844 });
  const menu = action(nav(page), 'Menu');
  await tabTo(page, menu);
  await page.keyboard.press('Enter');
  await expect(action(nav(page), 'CLOTHES')).toBeVisible();
  await tabTo(page, action(nav(page), 'CLOTHES'));
});
