import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-3.2.2
// fixtures: accounts.questionCreator

test('REQ-3.2.2: Required Field Validation', async ({ page }) => {
  await h.openAskQuestion(page, h.FIXTURES.accounts.questionCreatorValidation);
  await h.clickFirstAvailable(page, [[/post your question/i]]);
  await h.expectTextsVisible(page, [/title is required/i]);
  await h.fillField(page, [/title/i], h.FIXTURES.question.newTitle);
  await h.clickFirstAvailable(page, [[/post your question/i]]);
  await h.expectTextsVisible(page, [/question body is required/i]);
  await h.fillMarkdownBody(page, h.FIXTURES.question.body);
  await h.clickFirstAvailable(page, [[/post your question/i]]);
  await h.expectTextsVisible(page, [/please add at least one tag/i]);
  await h.fillField(page, [/tags/i], h.FIXTURES.question.tags[0]);
  await h.pressEnter(page, [/tags/i]);
});
