import { expectBodyAbsent, openRevisionHistory,test, expect, login, openQuestion, action, field, region, answer, createQuestion, createAnswer, asUser, expectBody , actorName } from './helpers';
import { answerBody } from './fixtures/data';

// requirement: REQ-4.8

test('REQ-4.8: Publish an actual answer correction', async ({ page, browser }, info) => {
  const title=await createQuestion(browser,info,'question_creator','SO Changed Answer Revision');
  await createAnswer(browser,title,'answer_edit_user');
  await login(page,'answer_edit_user'); await openQuestion(page,title);
  await action(answer(page,actorName('answer_edit_user')),'Edit answer').click();
  const revised='Use bounded exponential backoff, an idempotency key, and a deadline so retries remain safe and observable.';
  await field(page,'Body').fill(revised); await field(page,'Edit Summary').fill('Added deadline guidance.');
  await action(page,'Save edits').click();
  await expectBody(answer(page,actorName('answer_edit_user')),revised);
  await asUser(browser,'stack_user',async visitor => {
   await openQuestion(visitor,title); await visitor.reload();
   await expectBody(answer(visitor,actorName('answer_edit_user')),revised);
   await expectBodyAbsent(answer(visitor,actorName('answer_edit_user')),answerBody);
   await expect(answer(visitor,actorName('answer_edit_user'))).toContainText(/edited/i);
   await expect(await openRevisionHistory(answer(visitor,actorName('answer_edit_user')),'Added deadline guidance.')).toContainText('Added deadline guidance.');
  });
});
