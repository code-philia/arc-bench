import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-3.3.3
// fixtures: questions.detail

test('REQ-3.3.3: Post Voting and Interaction Sidebar', async ({ page }) => {
  await h.openQuestionDetail(page, h.FIXTURES.questions.detail);
  await h.expectTextsVisible(page, [/vote/i, /bookmark|save/i, /timeline|history/i]);
});
