import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-4.1
// fixtures: public_homepage, settings_state

test('REQ-4.1: Setting options list', async ({ page }) => {
  await h.openHome(page);
  await h.openSettingsMenu(page);
  const menu = page.getByRole('menu');
  await expect(menu.getByRole('menuitem', { name: /^Settings$/i })).toBeVisible();
  await expect(menu.getByRole('menuitem', { name: /^Help & feedback$/i })).toBeVisible();
  await expect(menu.getByRole('menuitem', { name: /^Send feedback$/i })).toBeVisible();
});
