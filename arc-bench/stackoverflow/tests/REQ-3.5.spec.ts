import { test, expect, login, openQuestion, action, region, mainNav, post, createQuestion, confirmDeletion, expectQuestionAbsent,openQuestions } from './helpers';
import { retryTitle } from './fixtures/data';

// requirement: REQ-3.5

test('REQ-3.5: Confirm own question deletion', async ({ page, browser }, info) => {
  const retained=await createQuestion(browser,info,'question_deleter','A retry question that remains public');
  const title = await createQuestion(browser,info,'question_deleter','SO Deletable Question');
  await login(page,'question_deleter');
  await openQuestion(page,title);
  await action(post(page),'Delete question').click();
  await confirmDeletion(page);
  await expect(region(page,'Question feed')).toBeVisible();
  await expectQuestionAbsent(page,title,retained);
  await openQuestion(page,retained);
  await openQuestions(page);
  await expect(action(region(page,'Question feed'),title)).toHaveCount(0);
});
