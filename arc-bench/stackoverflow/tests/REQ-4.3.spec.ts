import { acceptedAnswer, test, expect, login, openQuestion, action, region, answer, createQuestion, createAnswer, noUsableAction , actorName } from './helpers';
import {  } from './fixtures/data';

// requirement: REQ-4.3

test('REQ-4.3: Accept and replace definitive solution', async ({ page, browser }, info) => {
  const title=await createQuestion(browser,info,'answer_accept_owner','SO Accepted Answer Question');
  await createAnswer(browser,title); await createAnswer(browser,title,'answer_submitter','Use a bounded retry budget with diagnostics.');
  await login(page,'answer_accept_owner'); await openQuestion(page,title);
  await action(answer(page),'Accept answer').click();
  await expect(acceptedAnswer(answer(page))).toBeVisible();
  await page.reload();
  await expect(acceptedAnswer(answer(page))).toBeVisible();
  await action(answer(page,actorName('answer_submitter')),'Accept answer').click();
  await expect(acceptedAnswer(region(page,'Answers'))).toHaveCount(1);
  await expect(acceptedAnswer(answer(page,actorName('answer_submitter')))).toBeVisible();
  await expect(acceptedAnswer(answer(page))).toHaveCount(0);
  await page.reload();await expect(acceptedAnswer(region(page,'Answers'))).toHaveCount(1);await expect(acceptedAnswer(answer(page,actorName('answer_submitter')))).toBeVisible();
});

test('REQ-4.3: Prevent non-owner acceptance', async ({ page, browser }, info) => {
  const title=await createQuestion(browser,info,'answer_accept_owner','SO Accepted Answer Question');
  await createAnswer(browser,title);
  await login(page,'answer_voter'); await openQuestion(page,title);
  await noUsableAction(answer(page),'Accept answer');
  await expect(acceptedAnswer(region(page,'Answers'))).toHaveCount(0);
});
