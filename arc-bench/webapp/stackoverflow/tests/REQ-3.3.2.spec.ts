import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-3.3.2
// fixtures: questions.detail

test('REQ-3.3.2: Question Header and Metadata', async ({ page }) => {
  await h.openQuestionDetail(page, h.FIXTURES.questions.detail);
  await h.expectTextsVisible(page, [/asked/i, /modified/i, /viewed/i]);
});
