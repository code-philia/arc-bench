import { test, expect, login, openQuestion, answer, output, createQuestion, createAnswer, noUsableAction } from './helpers';
import { answerBody } from './fixtures/data';

// requirement: REQ-4.9

test('REQ-4.9: Prevent non-owner answer deletion', async ({ page, browser }, info) => {
  const title=await createQuestion(browser,info,'question_creator','SO Protected Answer Ownership');
  await createAnswer(browser,title); await login(page,'answer_voter'); await openQuestion(page,title);
  await noUsableAction(answer(page),'Delete'); await expect(answer(page)).toContainText(answerBody);
  await expect(output(page,'Answer count')).toHaveText('1');
});
