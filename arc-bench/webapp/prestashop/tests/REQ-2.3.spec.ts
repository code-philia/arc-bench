import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-2.3
// fixtures: public_homepage, products.detail

test('REQ-2.3: Popular Products Section', async ({ page }) => {
  await h.openHome(page);
  await page.getByRole('link', { name: /^Hummingbird detail t-shirt$/i }).first().click();
  await expect(page.getByRole('heading', { name: /^Hummingbird detail t-shirt$/i })).toBeVisible();
});
