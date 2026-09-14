import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-2.7.5
// fixtures: public_homepage, editable_label_catalog

test('REQ-2.7.5: Edit labels', async ({ page }) => {
  await h.openHome(page);
  await h.openSidebar(page);
  await h.clickNamed(page, /^Edit labels$/i);
  await h.renameLabel(page, h.FIXTURES.labels.editable, h.FIXTURES.labels.renamed);
  await expect(page.getByRole('textbox', { name: /^Label Projects$/i })).toBeVisible();
});
