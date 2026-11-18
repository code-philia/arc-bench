// requirement: REQ-7.1
import { test, expect } from '@playwright/test';
import { home, action, region, loginCustomer, account } from './helpers';

test("REQ-7.1: Inspect account overview", async ({ page }) => {
  await home(page);
  const customer = await loginCustomer(page);
  await account(page);
  await expect(page.getByRole('heading', { name: 'My account', exact: true })).toBeVisible();
  const overview = region(page, 'Account overview');
  await expect(overview).toContainText(customer.firstName + ' ' + customer.lastName);
  for (const name of ['Information', 'Addresses', 'Order history and details', 'Wishlist']) await expect(action(overview, name)).toBeVisible();
});
