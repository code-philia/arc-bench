// requirement: REQ-1.2
import { test, expect } from '@playwright/test';
import { home, nav, action, region, card, tabTo, DETAIL, selectField } from './helpers';

test("REQ-1.2: Browse Men and return with logo", async ({ page }) => {
  await home(page);
  await action(nav(page), 'CLOTHES').hover();
  for (const name of ['Men', 'Women']) await expect(action(nav(page), name)).toBeVisible();
  await action(nav(page), 'Men').click();
  await expect(page.getByRole('heading', { name: 'Men', exact: true })).toBeVisible();
  await expect(card(page, DETAIL)).toBeVisible();
  await expect(selectField(page, 'Sort by')).toBeVisible();
  await action(nav(page), 'Logo').click();
  await expect(page.getByRole('heading', { name: 'Popular Products', exact: true })).toBeVisible();
  await expect(action(region(page, 'Popular Products'), DETAIL)).toBeVisible();
});

test("REQ-1.2: Open subcategory by keyboard", async ({ page }) => {
  await home(page);
  await tabTo(page, action(nav(page), 'CLOTHES'));
  await page.keyboard.press('Enter');
  await expect(action(nav(page), 'Women')).toBeVisible();
  await tabTo(page, action(nav(page), 'Men'));
  await page.keyboard.press('Enter');
  await expect(page.getByRole('heading', { name: 'Men', exact: true })).toBeVisible();
});
