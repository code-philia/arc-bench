import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-6.3.1
// fixtures: accounts.checkoutExistingAddress, products.checkout631, address.home

test('REQ-6.3.1: Select Existing Address', async ({ page }) => {
  await h.login(page, h.FIXTURES.accounts.checkoutExistingAddress);
  await h.startCheckoutWithProduct(page, h.FIXTURES.products.checkout631);
  await page.getByRole('button', { name: /^Continue$/i }).click();
  await expect(page.getByRole('radio', { name: /^Home$/i })).toBeChecked();
});
