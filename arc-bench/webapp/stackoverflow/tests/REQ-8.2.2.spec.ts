import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-8.2.2
// fixtures: badge.catalog

test('REQ-8.2.2: View All Badges', async ({ page }) => {
  await h.openHome(page);
  await page.getByRole('navigation', { name: /^Primary navigation$/i }).getByRole('button', { name: /^Badges$/i }).click();
  await expect(page.getByRole('heading', { name: /^Badges$/i })).toBeVisible();
  await expect(page.getByRole('heading', { name: /^Gold badges$/i })).toBeVisible();
  await expect(page.getByRole('heading', { name: /^Silver badges$/i })).toBeVisible();
  await expect(page.getByRole('heading', { name: /^Bronze badges$/i })).toBeVisible();
  await expect(page.getByRole('heading', { name: /^Great Answer$/i })).toBeVisible();
  await expect(page.getByRole('heading', { name: /^Teacher$/i })).toBeVisible();
});
