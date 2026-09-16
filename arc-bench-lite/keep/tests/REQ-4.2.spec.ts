import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-4.2
// fixtures: public_homepage, settings_state

test('REQ-4.2: Detailed settings', async ({ page }) => {
  await h.openHome(page);
  await h.openSettingsMenu(page);
  await h.openDetailedSettings(page);
  await h.expectTextsVisible(page, [/^Save$/i, /^Cancel$/i, /Move new notes to the bottom/i]);
});
