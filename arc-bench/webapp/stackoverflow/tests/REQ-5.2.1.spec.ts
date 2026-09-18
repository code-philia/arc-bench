import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-5.2.1
// fixtures: accounts.commentEditUser, questions.commentEdit

test('REQ-5.2.1: Edit Comment', async ({ page }) => {
  await h.login(page, h.FIXTURES.accounts.commentEditUser);
  await h.openQuestionDetail(page, h.FIXTURES.questions.commentEdit);
  await page.getByRole('button', { name: /^Edit comment$/i }).click();
  await page.getByRole('textbox', { name: /^Comment$/i }).fill(h.FIXTURES.comment.updatedBody);
  await page.getByRole('textbox', { name: /^Comment$/i }).press('Enter');
  await h.expectTextsVisible(page, [/edited/i]);
});
