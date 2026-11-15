import { acceptedAnswer,test, expect, login, openQuestion, action, answer, createQuestion, createAnswer, asUser, noUsableAction, expectBody , actorName } from './helpers';
import { answerBody } from './fixtures/data';

// requirement: REQ-4.10

test('REQ-4.10: Keep the accepted solution protected', async ({ page, browser }, info) => {
  const title=await createQuestion(browser,info,'answer_accept_owner','SO Protected Accepted Answer');
  await createAnswer(browser,title,'answer_delete_user');
  await asUser(browser,'answer_accept_owner',async owner => {
   await openQuestion(owner,title); await action(answer(owner,actorName('answer_delete_user')),'Accept answer').click();
   await expect(acceptedAnswer(answer(owner,actorName('answer_delete_user')))).toBeVisible();
  });
  await login(page,'answer_delete_user'); await openQuestion(page,title);
  await expect(acceptedAnswer(answer(page,actorName('answer_delete_user')))).toBeVisible();
  await noUsableAction(answer(page,actorName('answer_delete_user')),'Delete answer');
  await expectBody(answer(page,actorName('answer_delete_user')),answerBody);
});
