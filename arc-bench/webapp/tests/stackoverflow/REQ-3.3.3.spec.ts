import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-3.3.3
// fixtures: question_detail

test('REQ-3.3.3: Post Voting and Interaction Sidebar', async ({ page }) => {
  await h.openQuestionDetail(page);
  await h.expectTextsVisible(page, [/vote/i, /bookmark|save/i, /timeline|history/i]);
});
