import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-4.2
// fixtures: accounts.answerVoter, questions.answerVoting

test('REQ-4.2: Answer Evaluation (Voting)', async ({ page }) => {
  await h.login(page, h.FIXTURES.accounts.answerVoter);
  await h.openQuestionDetail(page, h.FIXTURES.questions.answerVoting);
  await h.clickAnswerAction(page, [/answer upvote|upvote/i]);
  await h.expectTextsVisible(page, [/score|reputation/i]);
});
