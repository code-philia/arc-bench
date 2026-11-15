import {test, expect, login, openQuestion, action, post, comment, createQuestion, createComment, expectBody, actorName } from './helpers';
import { body } from './fixtures/data';

// requirement: REQ-5.5

test('REQ-5.5: Remove comment without confirmation', async ({ page, browser }, info) => {
  const title=await createQuestion(browser,info,'question_creator','SO Comment Delete Question');
  const otherText='Please explain the retry deadline.';await createComment(browser,title,'helpful_user',otherText);
  await createComment(browser,title,'comment_delete_user');
  await login(page,'comment_delete_user'); await openQuestion(page,title);
  await action(comment(post(page)),'Delete comment').click();
  await expect(comment(post(page))).toHaveCount(0);
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await page.reload();
  await expect(comment(post(page))).toHaveCount(0);
  await expectBody(post(page),body);await expectBody(comment(post(page),otherText),otherText);await expect(comment(post(page),otherText)).toContainText(actorName('helpful_user'));
  await expect(page.getByRole('heading',{name:title,exact:true})).toBeVisible();
});
