import { test, expect, login, openQuestion, action, region, answer, createQuestion, createAnswer, noUsableAction } from './helpers';
import {  } from './fixtures/data';

// requirement: REQ-4.3

test('REQ-4.3: Accept and replace definitive solution', async ({ page, browser }, info) => {
  const title=await createQuestion(browser,info,'answer_accept_owner','SO Accepted Answer Question');
  await createAnswer(browser,title); await createAnswer(browser,title,'answer_submitter','Use a bounded retry budget with diagnostics.');
  await login(page,'answer_accept_owner'); await openQuestion(page,title);
  await action(answer(page),'Accept answer').click();
  await expect(action(answer(page),'Accepted answer')).toBeVisible();
  await page.reload();
  await expect(action(answer(page),'Accepted answer')).toBeVisible();
  await action(answer(page,'Stack User'),'Accept answer').click();
  await expect(action(region(page,'Answers'),'Accepted answer')).toHaveCount(1);
  await expect(action(answer(page,'Stack User'),'Accepted answer')).toBeVisible();
  await expect(action(answer(page),'Accepted answer')).toHaveCount(0);
});

test('REQ-4.3: Prevent non-owner acceptance', async ({ page, browser }, info) => {
  const title=await createQuestion(browser,info,'answer_accept_owner','SO Accepted Answer Question');
  await createAnswer(browser,title);
  await login(page,'answer_voter'); await openQuestion(page,title);
  await noUsableAction(answer(page),'Accept answer');
  await expect(action(region(page,'Answers'),'Accepted answer')).toHaveCount(0);
});
