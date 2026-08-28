import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-2.7.5
// fixtures: public_homepage, editable_label_catalog

test('REQ-2.7.5: Edit labels', async ({ page }) => {
  await h.openHome(page);
  await h.openSidebar(page);
  await h.clickFirstAvailable(page, [[/edit labels/i]]);
  await h.fillField(page, [h.FIXTURES.labels.editable, /label name/i], h.FIXTURES.labels.renamed);
  await h.closeEditor(page);
  await h.expectTextsVisible(page, [h.FIXTURES.labels.renamed]);
});
