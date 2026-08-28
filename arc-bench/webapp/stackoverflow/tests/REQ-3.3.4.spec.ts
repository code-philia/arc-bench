import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-3.3.4
// fixtures: questions.detail, tags.catalog

test('REQ-3.3.4: Main Post Content and Tags', async ({ page }) => {
  await h.openQuestionDetail(page, h.FIXTURES.questions.detail);
  await h.expectTextsVisible(page, [/node\.js/i, /http/i, /retry/i]);
});
