import {test, expect, login, openQuestion, activity, action, field, answer, output, publishAnswer, createQuestion, expectNumeric, expectBody , actorName } from './helpers';
import { answerBody } from './fixtures/data';

// requirement: REQ-4.1

test('REQ-4.1: Publish and discover own answer', async ({ page, browser }, info) => {
  const title=await createQuestion(browser,info,'question_creator','SO Answer Submission Question');
  await login(page,'answer_submitter'); await openQuestion(page,title);
  await expect(field(page,'Your Answer')).toBeVisible();
  await publishAnswer(page);
  await expectBody(answer(page,actorName('answer_submitter')),answerBody);
  await expectNumeric(page,'Answer count',1);
  await page.reload();
  await expectNumeric(page,'Answer count',1);
  await expectBody(answer(page,actorName('answer_submitter')),answerBody);
  const content=await activity(page,'Answers');
  await expect(action(content,title)).toBeVisible();
  await expect(content).toContainText(answerBody);
});
