import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-3.3.4
// fixtures: question_detail

test('REQ-3.3.4: Main Post Content and Tags', async ({ page }) => {
  await h.openQuestionDetail(page);
  await h.expectTextsVisible(page, [/node\.js/i, /http/i, /retry/i]);
});
