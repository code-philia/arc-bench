import { test, expect, login, openQuestion, post, answer, comment, publishComment, createQuestion, createAnswer, expectCommentTimestamp, expectBody , actorName } from './helpers';
import { commentBody } from './fixtures/data';

// requirement: REQ-5.7

test('REQ-5.7: Publish in the answer thread', async ({ page, browser }, info) => {
  const title=await createQuestion(browser,info,'question_creator','SO Answer Comment Question');
  await createAnswer(browser,title);
  await login(page,'answer_comment_user'); await openQuestion(page,title);
  const posted=await publishComment(answer(page));
  await expect(comment(answer(page))).toContainText(actorName('answer_comment_user'));
  await expectCommentTimestamp(comment(answer(page)),posted,{author:actorName('answer_comment_user'),body:commentBody});
  await expect(comment(post(page))).toHaveCount(0);
  await page.reload();
  await expect(comment(answer(page))).toContainText(actorName('answer_comment_user'));
  await expect(comment(post(page))).toHaveCount(0);
  await expectBody(comment(answer(page)),commentBody);await expectCommentTimestamp(comment(answer(page)),posted,{author:actorName('answer_comment_user'),body:commentBody});
});
