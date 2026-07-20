import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-4.2
// fixtures: public_homepage, settings_state

test('REQ-4.2: Detailed settings', async ({ page }) => {
  await h.openHome(page);
  await h.openSettingsMenu(page);
  await h.clickFirstAvailable(page, [[/^settings$/i]]);
  await h.expectTextsVisible(page, [/save/i, /cancel/i, /bottom/i]);
});
