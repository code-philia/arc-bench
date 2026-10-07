import { test, expect, login, openQuestion, action, field, region, answer, createQuestion, createAnswer, asUser } from './helpers';
import { answerBody } from './fixtures/data';

// requirement: REQ-4.8

test('REQ-4.8: Publish an actual answer correction', async ({ page, browser }, info) => {
  const title=await createQuestion(browser,info,'question_creator','SO Changed Answer Revision');
  await createAnswer(browser,title,'answer_edit_user');
  await login(page,'answer_edit_user'); await openQuestion(page,title);
  await action(answer(page,'Stack User'),'Edit').click();
  const revised='Use bounded exponential backoff, an idempotency key, and a deadline so retries remain safe and observable.';
  await field(page,'Body').fill(revised); await field(page,'Edit Summary').fill('Added deadline guidance.');
  await action(page,'Save edits').click();
  await expect(answer(page,'Stack User')).toContainText(revised);
  await asUser(browser,'stack_user',async visitor => {
   await openQuestion(visitor,title); await visitor.reload();
   await expect(answer(visitor,'Stack User')).toContainText(revised);
   await expect(answer(visitor,'Stack User')).not.toContainText(answerBody);
   await expect(answer(visitor,'Stack User')).toContainText(/edited/i);
   await action(answer(visitor,'Stack User'),'Timeline').click();
   await expect(region(visitor,'Revision history')).toContainText('Added deadline guidance.');
  });
});
