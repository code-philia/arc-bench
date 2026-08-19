import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-3.3.5
// fixtures: question_detail

test('REQ-3.3.5: Post Author and Ownership Card', async ({ page }) => {
  await h.openQuestionDetail(page);
  await h.expectTextsVisible(page, [/asked/i, /reputation/i, /user/i]);
});
