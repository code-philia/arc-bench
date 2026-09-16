import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-1.1
// fixtures: public_homepage

test('REQ-1.1: View Global Navigation', async ({ page }) => {
  await h.openHome(page);
  await expect(page.getByRole('link', { name: /^Logo$/i })).toBeVisible();
  await expect(page.getByRole('navigation', { name: /^Main navigation$/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /^Clothes$/i })).toBeVisible();
  await expect(page.getByRole('textbox', { name: /^Search$/i })).toBeVisible();
  await expect(page.getByRole('combobox', { name: /^Language$/i })).toBeVisible();
  await expect(page.getByRole('link', { name: /^Sign in$/i })).toBeVisible();
  await expect(page.getByRole('link', { name: /^Shopping cart$/i })).toBeVisible();
});
