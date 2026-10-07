import { test, expect, login, openQuestion, action, field, region, answer, createQuestion, createAnswer } from './helpers';
import { body, answerBody } from './fixtures/data';

// requirement: REQ-4.5

test('REQ-4.5: Record same-body answer revision', async ({ page, browser }, info) => {
  const title=await createQuestion(browser,info,'question_creator','SO Successful Answer Edit Question');
  await createAnswer(browser,title,'answer_edit_user');
  await login(page,'answer_edit_user'); await openQuestion(page,title);
  await action(answer(page,'Stack User'),'Edit').click();
  await expect(field(page,'Body')).toHaveValue(answerBody);
  await field(page,'Body').fill(answerBody);
  await field(page,'Edit Summary').fill('Clarified retry safety.');
  await action(page,'Save edits').click();
  await expect(answer(page,'Stack User')).toContainText(answerBody);
  await expect(answer(page,'Stack User')).toContainText(/edited/i);
  await action(answer(page,'Stack User'),'Timeline').click();
  await expect(region(page,'Revision history')).toContainText('Clarified retry safety.');
});

test('REQ-4.5: Reject empty answer edit', async ({ page, browser }, info) => {
  const title=await createQuestion(browser,info,'question_creator','SO Answer Validation Question');
  await createAnswer(browser,title,'answer_validation_user');
  await login(page,'answer_validation_user'); await openQuestion(page,title);
  await action(answer(page,'Stack User'),'Edit').click();
  await field(page,'Body').fill(''); await action(page,'Save edits').click();
  await expect(page.getByText('Body cannot be empty',{exact:true})).toBeVisible();
  await expect(field(page,'Body')).toBeVisible();
  await action(page,'Cancel').click();
  await expect(answer(page,'Stack User')).toContainText(answerBody);
});

test('REQ-4.5: Cancel answer edit', async ({ page, browser }, info) => {
  const title=await createQuestion(browser,info,'question_creator','SO Answer Validation Question');
  await createAnswer(browser,title,'answer_validation_user');
  await login(page,'answer_validation_user'); await openQuestion(page,title);
  await action(answer(page,'Stack User'),'Edit').click();
  await field(page,'Body').fill('Unsaved answer edit draft.'); await action(page,'Cancel').click();
  await expect(field(page,'Body')).toHaveCount(0);
  await expect(answer(page,'Stack User')).toContainText(answerBody);
  await expect(answer(page,'Stack User')).not.toContainText('Unsaved answer edit draft.');
});
