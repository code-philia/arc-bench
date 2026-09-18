import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-0
// fixtures: public_homepage, homepage_questions

test('REQ-0: Enter Platform', async ({ page }) => {
  await h.openHome(page);
  await expect(page.getByRole('banner')).toBeVisible();
  await expect(page.getByRole('main')).toBeVisible();
  await expect(page.getByRole('button', { name: /^Questions$/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /^Tags$/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /^Users$/i })).toBeVisible();
  await expect(page.getByRole('textbox', { name: /^Search$/i })).toBeVisible();
  await expect(page.getByRole('article').first()).toBeVisible();
});
