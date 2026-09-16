import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-3.5.2
// fixtures: category_listing

test('REQ-3.5.2: Hover to Show Action Buttons', async ({ page }) => {
  await h.openCategoryPage(page);
  const card = page.getByRole('article').filter({ hasText: 'Hummingbird detail t-shirt' });
  await card.hover();
  await expect(card.getByRole('button', { name: /^Quick view$/i })).toBeVisible();
  await expect(card.getByRole('button', { name: /^Add to wishlist$/i })).toBeVisible();
});
