import { test, expect, login, openQuestion, action, region, post, answer, createQuestion, createAnswer, numeric, expectNumeric } from './helpers';
import {  } from './fixtures/data';

// requirement: REQ-4.2

test('REQ-4.2: Apply and remove answer upvote', async ({ page, browser }, info) => {
  const title=await createQuestion(browser,info,'question_creator','SO Answer Voting Question');
  await createAnswer(browser,title);
  await login(page,'answer_voter'); await openQuestion(page,title);
  const target=answer(page), author=region(target,'Author');
  const reputation=await numeric(author,'Reputation'), questionScore=await numeric(post(page),'Score');
  await expectNumeric(target,'Score',0);
  await action(target,'Up vote').click();
  await expectNumeric(target,'Score',1);
  await expect(action(target,'Up vote')).toHaveAttribute('aria-pressed','true');
  await expectNumeric(author,'Reputation',reputation+10);
  await expectNumeric(post(page),'Score',questionScore);
  await action(target,'Up vote').click();
  await expectNumeric(target,'Score',0);
  await expect(action(target,'Up vote')).toHaveAttribute('aria-pressed','false');
  await expectNumeric(author,'Reputation',reputation);
  await expectNumeric(post(page),'Score',questionScore);
});
