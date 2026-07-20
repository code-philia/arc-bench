import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-3.3.6
// fixtures: question_detail

test('REQ-3.3.6: Question Comments and Inline Interaction', async ({ page }) => {
  await h.openQuestionDetail(page);
  await h.expectTextsVisible(page, [/add a comment/i, /comment/i]);
});
