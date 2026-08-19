import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-4.1
// fixtures: public_homepage, settings_state

test('REQ-4.1: Setting options list', async ({ page }) => {
  await h.openHome(page);
  await h.openSettingsMenu(page);
  await h.expectTextsVisible(page, [/settings/i]);
});
