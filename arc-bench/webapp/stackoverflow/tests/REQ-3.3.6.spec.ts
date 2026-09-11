import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-3.3.6
// fixtures: questions.detail

test('REQ-3.3.6: Question Comments and Inline Interaction', async ({ page }) => {
  await h.openQuestionDetail(page, h.FIXTURES.questions.detail);
  await h.expectTextsVisible(page, [/add a comment/i, /comment/i]);
});
