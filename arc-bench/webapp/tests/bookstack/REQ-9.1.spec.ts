import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-9.1
// fixtures: recently_updated_page

test('REQ-9.1: Quick Navigation from Recently Updated', async ({ page }) => {
  await h.openPageEditor(page);
  await h.fillPageEditor(page);
  await h.clickNamed(page, /Save Page/i);
  await h.returnHomeByLogo(page);
  await h.clickNamed(page, h.FIXTURES.page.name);
  await h.expectTextsVisible(page, [h.FIXTURES.page.name]);
});
