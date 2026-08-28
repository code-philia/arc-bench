import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-3.5
// fixtures: accounts.questionDeleter, questions.deletable

test('REQ-3.5: Delete Question', async ({ page }) => {
  await h.login(page, h.FIXTURES.accounts.questionDeleter);
  await h.openQuestionDetail(page, h.FIXTURES.questions.deletable);
  await h.clickFirstAvailable(page, [[/^delete$/i]]);
  await h.expectTextsVisible(page, [/deletion implications|are you sure|delete question/i]);
  await h.clickFirstAvailable(page, [[/confirm deletion|delete/i]]);
  await h.expectHomepage(page);
});
