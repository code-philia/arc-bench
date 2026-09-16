import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-5.1
// fixtures: products.cart51

test('REQ-5.1: Enter Cart', async ({ page }) => {
  await h.openCartWithProduct(page, h.FIXTURES.products.cart51);
  await expect(page.getByRole('heading', { name: /^Shopping cart$/i })).toBeVisible();
});
