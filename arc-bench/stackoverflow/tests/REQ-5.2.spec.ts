import { test, expect, login, openQuestion, post, comment, publishComment, createQuestion, expectCommentTimestamp, expectBody , actorName } from './helpers';
import { commentBody } from './fixtures/data';

// requirement: REQ-5.2

test('REQ-5.2: Publish a question comment', async ({ page, browser }, info) => {
  const title=await createQuestion(browser,info,'question_creator','SO Question Comment Question');
  await login(page,'question_comment_user'); await openQuestion(page,title);
  const posted=await publishComment(post(page));
  await expect(comment(post(page))).toContainText(actorName('question_comment_user'));
  await expectCommentTimestamp(comment(post(page)),posted);
  await page.reload(); await expect(comment(post(page))).toBeVisible();
  await expectBody(comment(post(page)),commentBody);await expectCommentTimestamp(comment(post(page)),posted);
});
