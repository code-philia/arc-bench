// requirement: REQ-2.1
import { test, expect } from '@playwright/test';
import { home, nav, action, region, count, men, selectField, navigation } from './helpers';

test("REQ-2.1: Inspect category and breadcrumb", async ({ page }) => {
  await home(page); await men(page);
  await expect(page.getByRole('heading', { name: 'Men', exact: true })).toBeVisible();
  await expect(region(page, 'Category description')).toContainText('Men');
  const breadcrumb = navigation(page, 'Breadcrumb');
  await expect(breadcrumb).toHaveText(/Home\s*.*CLOTHES\s*.*Men/);
  await expect(count(page)).toBeVisible();
  await expect(selectField(page, 'Sort by')).toBeVisible();
  await expect(region(page, 'Product list')).toBeVisible();
});

test("REQ-2.1: Return to parent category", async ({ page }) => {
  await home(page); await men(page);
  await action(navigation(page, 'Breadcrumb'), 'CLOTHES').click();
  await expect(page.getByRole('heading', { name: 'CLOTHES', exact: true })).toBeVisible();
  await expect(action(region(page, 'Subcategories'), 'Men')).toBeVisible();
});

test("REQ-2.1: Browse Women from parent", async ({ page }) => {
  await home(page); await action(nav(page), 'CLOTHES').click();
  await expect(action(region(page, 'Subcategories'), 'Men')).toBeVisible();
  await action(region(page, 'Subcategories'), 'Women').click();
  await expect(page.getByRole('heading', { name: 'Women', exact: true })).toBeVisible();
  await expect(selectField(page, 'Sort by')).toBeVisible();
});
