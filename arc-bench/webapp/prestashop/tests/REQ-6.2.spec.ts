import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-6.2
// fixtures: accounts.checkoutInformation, products.checkout62

test('REQ-6.2: Personal Information Step', async ({ page }) => {
  await h.login(page, h.FIXTURES.accounts.checkoutInformation);
  await h.startCheckoutWithProduct(page, h.FIXTURES.products.checkout62);
  await expect(page.getByRole('heading', { name: /^Personal information$/i })).toBeVisible();
  for (const field of ['Email address *', 'First name *', 'Last name *']) {
    await expect(page.getByLabel(field, { exact: true })).toBeVisible();
  }
});
