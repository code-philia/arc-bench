import { test, expect, login, openQuestion, action, post, comment, createQuestion, createComment } from './helpers';
import { body } from './fixtures/data';

// requirement: REQ-5.4

test('REQ-5.4: Remove comment without confirmation', async ({ page, browser }, info) => {
  const title=await createQuestion(browser,info,'question_creator','SO Comment Delete Question');
  await createComment(browser,title,'comment_delete_user');
  await login(page,'comment_delete_user'); await openQuestion(page,title);
  await action(comment(post(page)),'Delete').click();
  await expect(comment(post(page))).toHaveCount(0);
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(page.getByRole('heading',{name:title,exact:true})).toBeVisible();
});
