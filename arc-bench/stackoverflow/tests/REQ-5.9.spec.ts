import { test, expect, login, openQuestion, post, comment, createQuestion, createComment, noUsableAction, actorName } from './helpers';
import { commentBody } from './fixtures/data';

// requirement: REQ-5.9

test('REQ-5.9: Refuse another user comment maintenance', async ({ page, browser }, info) => {
  const title=await createQuestion(browser,info,'question_creator','SO Protected Comment Ownership');
  await createComment(browser,title,'helpful_user'); await login(page,'stack_user'); await openQuestion(page,title);
  const target=comment(post(page));
  await noUsableAction(target,'Edit comment'); await noUsableAction(target,'Delete comment');
  await expect(target).toContainText(commentBody); await expect(target).toContainText(actorName('helpful_user'));
});
