import { test, expect, login, openQuestion, post, comment, publishComment, createQuestion } from './helpers';
import {  } from './fixtures/data';

// requirement: REQ-5.1

test('REQ-5.1: Publish a question comment', async ({ page, browser }, info) => {
  const title=await createQuestion(browser,info,'question_creator','SO Question Comment Question');
  await login(page,'question_comment_user'); await openQuestion(page,title);
  await publishComment(post(page));
  await expect(comment(post(page))).toContainText('Stack User');
  await expect(comment(post(page))).toContainText(/2026|ago|just now/);
  await page.reload(); await expect(comment(post(page))).toBeVisible();
});
