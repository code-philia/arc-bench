import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-3.3.3
// fixtures: questions.detail

test('REQ-3.3.3: Post Voting and Interaction Sidebar', async ({ page }) => {
  await h.openQuestionDetail(page, h.FIXTURES.questions.detail);
  await expect(page.getByRole('button', { name: /^Upvote$/i }).first()).toBeVisible();
  await expect(page.getByRole('button', { name: /^Downvote$/i }).first()).toBeVisible();
  await expect(page.getByRole('button', { name: /^Save$/i }).first()).toBeVisible();
  await expect(page.getByRole('button', { name: /^Timeline$/i }).first()).toBeVisible();
});
