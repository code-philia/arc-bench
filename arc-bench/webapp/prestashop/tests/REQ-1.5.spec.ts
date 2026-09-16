import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-1.5
// fixtures: public_homepage

test('REQ-1.5: User Entry', async ({ page }) => {
  await h.openSignIn(page);
  await expect(page.getByRole('heading', { name: /^Sign in$/i }).first()).toBeVisible();
  await expect(page.getByLabel('Email address *', { exact: true })).toBeVisible();
  await expect(page.getByLabel('Password *', { exact: true })).toBeVisible();
});
