import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-2.7.3
// fixtures: label_catalog

test('REQ-2.7.3: Default label', async ({ page }) => {
  await h.openHome(page);
  await h.openSidebar(page);
  await h.expectTextsVisible(page, [h.FIXTURES.labels.default]);
});
