import { expectBodyAbsent, openRevisionHistory,test, expect, login, openQuestion, action, field, region, answer, createQuestion, createAnswer, expectBody, expectField , actorName } from './helpers';
import { body, answerBody } from './fixtures/data';

// requirement: REQ-4.5

test('REQ-4.5: Record same-body answer revision', async ({ page, browser }, info) => {
  const title=await createQuestion(browser,info,'question_creator','SO Successful Answer Edit Question');
  await createAnswer(browser,title,'answer_edit_user');
  await login(page,'answer_edit_user'); await openQuestion(page,title);
  await action(answer(page,actorName('answer_edit_user')),'Edit answer').click();
  await expectField(field(page,'Body'),answerBody);await expectField(field(page,'Edit Summary'),'');
  await field(page,'Body').fill(answerBody);
  await field(page,'Edit Summary').fill('Clarified retry safety.');
  await action(page,'Save edits').click();
  await expectBody(answer(page,actorName('answer_edit_user')),answerBody);
  await expect(answer(page,actorName('answer_edit_user'))).toContainText(/edited/i);
  await expect(await openRevisionHistory(answer(page,actorName('answer_edit_user')))).toContainText('Clarified retry safety.');
  await page.reload();
  await expect(await openRevisionHistory(answer(page,actorName('answer_edit_user')))).toContainText('Clarified retry safety.');
  await openQuestion(page,title);
  await expectBody(answer(page,actorName('answer_edit_user')),answerBody);
});

test('REQ-4.5: Reject empty answer edit', async ({ page, browser }, info) => {
  const title=await createQuestion(browser,info,'question_creator','SO Answer Validation Question');
  await createAnswer(browser,title,'answer_validation_user');
  await login(page,'answer_validation_user'); await openQuestion(page,title);
  await action(answer(page,actorName('answer_validation_user')),'Edit answer').click();
  await field(page,'Body').fill(''); await action(page,'Save edits').click();
  await expect(page.getByText('Body cannot be empty',{exact:true})).toBeVisible();
  await expect(field(page,'Body')).toBeVisible();
  await action(page,'Cancel').click();
  await expectBody(answer(page,actorName('answer_validation_user')),answerBody);
  await page.reload();
  await expectBody(answer(page,actorName('answer_validation_user')),answerBody);
});

test('REQ-4.5: Cancel answer edit', async ({ page, browser }, info) => {
  const title=await createQuestion(browser,info,'question_creator','SO Answer Validation Question');
  await createAnswer(browser,title,'answer_validation_user');
  await login(page,'answer_validation_user'); await openQuestion(page,title);
  await action(answer(page,actorName('answer_validation_user')),'Edit answer').click();
  await field(page,'Body').fill('Unsaved answer edit draft.');await field(page,'Edit Summary').fill('Unsaved answer summary.'); await action(page,'Cancel').click();
  await expect(field(page,'Body')).toHaveCount(0);
  await expectBody(answer(page,actorName('answer_validation_user')),answerBody);
  await page.reload();
  await expectBody(answer(page,actorName('answer_validation_user')),answerBody);
  await expectBodyAbsent(answer(page,actorName('answer_validation_user')),'Unsaved answer edit draft.');
  const target=answer(page,actorName('answer_validation_user'));await action(target,'Timeline').click();
  await expect(region(target,'Revision history').filter({hasText:'Unsaved answer summary.'})).toHaveCount(0);
});
