import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-8.1
// fixtures: accounts.login

test('REQ-8.1: Enter My Account', async ({ page }) => {
  await h.openMyAccount(page, h.FIXTURES.accounts.login);
  await expect(page.getByRole('heading', { name: /^My account$/i }).first()).toBeVisible();
  for (const name of ['Information', 'Addresses', 'Order history and details']) {
    await expect(page.getByRole('link', { name, exact: true }).first()).toBeVisible();
  }
});
