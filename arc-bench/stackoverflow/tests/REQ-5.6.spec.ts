import { test, expect, login, openQuestion, post, answer, comment, publishComment, createQuestion, createAnswer } from './helpers';
import {  } from './fixtures/data';

// requirement: REQ-5.6

test('REQ-5.6: Publish in the answer thread', async ({ page, browser }, info) => {
  const title=await createQuestion(browser,info,'question_creator','SO Answer Comment Question');
  await createAnswer(browser,title);
  await login(page,'answer_comment_user'); await openQuestion(page,title);
  await publishComment(answer(page));
  await expect(comment(answer(page))).toContainText('Stack User');
  await expect(comment(answer(page))).toContainText(/2026|ago|just now/);
  await expect(comment(post(page))).toHaveCount(0);
  await page.reload();
});
