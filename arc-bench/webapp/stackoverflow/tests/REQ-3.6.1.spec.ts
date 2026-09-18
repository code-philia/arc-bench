import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-3.6.1
// fixtures: accounts.questionUpvoter, questions.upvote

test('REQ-3.6.1: Upvote Question', async ({ page }) => {
  await h.login(page, h.FIXTURES.accounts.questionUpvoter);
  await h.openQuestionDetail(page, h.FIXTURES.questions.upvote);
  const questionVoting = page.getByRole('article').filter({ hasText: /Safe retry strategy/i }).getByRole('group').first();
  const score = questionVoting.getByRole('status', { name: /^Vote score$/i });
  const initial = await score.textContent();
  await questionVoting.getByRole('button', { name: /^Upvote$/i }).click();
  await expect(score).not.toHaveText(initial || '');
  await questionVoting.getByRole('button', { name: /^Upvote$/i }).click();
  await expect(score).toHaveText(initial || '');
});
