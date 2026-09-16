import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-3.5.1
// fixtures: category_listing

test('REQ-3.5.1: View Product Cards', async ({ page }) => {
  await h.openCategoryPage(page);
  const card = page.getByRole('article').filter({ hasText: 'Hummingbird detail t-shirt' });
  await expect(card.getByText('Sale', { exact: true })).toBeVisible();
  await expect(card.getByText('€19.99', { exact: true })).toBeVisible();
  await expect(card.getByText('€24.99', { exact: true })).toBeVisible();
});
