import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-2.7.2
// fixtures: public_homepage, label_catalog, labeled_note

test('REQ-2.7.2: Remove label from a note', async ({ page }) => {
  await h.openHome(page);
  await h.openLabelDialogForNote(page, h.FIXTURES.notes.labelTitle);
  await h.setLabel(page, h.FIXTURES.labels.work, false);
  await h.closeEditor(page);
  await h.expectTextAbsent(page, h.FIXTURES.labels.work);
});
