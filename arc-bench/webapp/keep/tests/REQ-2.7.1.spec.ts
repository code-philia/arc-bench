import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-2.7.1
// fixtures: public_homepage, label_catalog, labeled_note

test('REQ-2.7.1: Assign label to a note', async ({ page }) => {
  await h.openHome(page);
  await h.openLabelDialogForNote(page, h.FIXTURES.notes.labelAddTitle);
  await h.setLabel(page, h.FIXTURES.labels.work, true);
  await h.closeEditor(page);
  await h.expectTextsVisible(page, [h.FIXTURES.labels.work]);
});
