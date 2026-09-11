import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-5.1.2
// fixtures: questions.expandedComments

test('REQ-5.1.2: View All Comments', async ({ page }) => {
  await h.openQuestionDetail(page, h.FIXTURES.questions.expandedComments);
  await h.clickFirstAvailable(page, [[/show .* more comments/i]]);
  await h.expectTextsVisible(page, [/comment/i, /helpful user/i]);
});
