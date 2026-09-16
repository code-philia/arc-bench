import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-8.2
// fixtures: accounts.login

test('REQ-8.2: Account Overview', async ({ page }) => {
  await h.openMyAccount(page, h.FIXTURES.accounts.login);
  for (const name of ['Order history and details', 'Addresses', 'Information']) {
    await expect(page.getByRole('link', { name, exact: true }).first()).toBeVisible();
  }
});
