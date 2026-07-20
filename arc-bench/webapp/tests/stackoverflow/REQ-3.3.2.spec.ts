import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-3.3.2
// fixtures: question_detail

test('REQ-3.3.2: Question Header and Metadata', async ({ page }) => {
  await h.openQuestionDetail(page);
  await h.expectTextsVisible(page, [/asked/i, /modified/i, /viewed/i]);
});
