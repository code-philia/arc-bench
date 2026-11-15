import { test, expect, login, openQuestion, action, field, post, answer, comment, createQuestion, createAnswer, createComment, expectBody , actorName } from './helpers';
import { commentBody } from './fixtures/data';

// requirement: REQ-5.10

test('REQ-5.10: Preserve question and answer thread boundaries', async ({ page, browser }, info) => {
  const title=await createQuestion(browser,info,'question_creator','SO Separate Comment Threads');
  await createAnswer(browser,title); await createComment(browser,title,'question_comment_user');
  await login(page,'answer_comment_user'); await openQuestion(page,title);
  const text='Please explain the retry deadline.';
  await action(answer(page),'Add a comment').click(); await field(answer(page),'Comment').fill(text); await field(answer(page),'Comment').press('Enter');
  await expect(comment(answer(page),text)).toBeVisible(); await page.reload();
  await expect(comment(post(page))).toContainText(actorName('question_comment_user'));
  await expect(comment(post(page),text)).toHaveCount(0);
  await expect(comment(answer(page),text)).toContainText(actorName('answer_comment_user'));
  await expect(comment(answer(page))).toHaveCount(0);
  await expectBody(comment(post(page)),commentBody);
  await expectBody(comment(answer(page),text),text);
});
