import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-3.2.1
// fixtures: accounts.questionCreator, tags.catalog

test('REQ-3.2.1: Create New Question', async ({ page }) => {
  await h.openAskQuestion(page, h.FIXTURES.accounts.questionCreator);
  await h.expectTextsVisible(page, [/ask question/i, /title/i, /body/i, /tags/i]);
  await h.fillField(page, [/title/i], h.FIXTURES.question.newTitle);
  await h.expectTextsVisible(page, [/character/i, /title/i]);
  await h.fillMarkdownBody(page, h.FIXTURES.question.body);
  await h.expectTextsVisible(page, [/preview/i]);
  await h.fillField(page, [/tags/i], h.FIXTURES.question.tags[0]);
  await h.expectTextsVisible(page, [/tag suggestions|node\.js|http|retry/i]);
  await h.clickFirstAvailable(page, [[/post your question/i]]);
  await h.expectTextsVisible(page, [/question/i, /answers/i]);
});
