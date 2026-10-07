import { test, expect, login, openQuestion, action, answer, createQuestion, createAnswer, asUser, noUsableAction } from './helpers';
import { answerBody } from './fixtures/data';

// requirement: REQ-4.10

test('REQ-4.10: Keep the accepted solution protected', async ({ page, browser }, info) => {
  const title=await createQuestion(browser,info,'answer_accept_owner','SO Protected Accepted Answer');
  await createAnswer(browser,title,'answer_delete_user');
  await asUser(browser,'answer_accept_owner',async owner => {
   await openQuestion(owner,title); await action(answer(owner,'Stack User'),'Accept answer').click();
   await expect(action(answer(owner,'Stack User'),'Accepted answer')).toBeVisible();
  });
  await login(page,'answer_delete_user'); await openQuestion(page,title);
  await expect(action(answer(page,'Stack User'),'Accepted answer')).toBeVisible();
  await noUsableAction(answer(page,'Stack User'),'Delete');
  await expect(answer(page,'Stack User')).toContainText(answerBody);
});
