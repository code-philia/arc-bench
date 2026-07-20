import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-3.3.1
// fixtures: question_detail

test('REQ-3.3.1: Default Question View', async ({ page }) => {
  await h.openQuestionDetail(page);
  await h.expectTextsVisible(page, [/header/i, /sidebar/i, /question/i, /answers/i]);
});
