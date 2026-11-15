// requirement: REQ-5.1
import { test, expect, entry, action, mainNav, region, openQuestion, post, createQuestion } from './helpers';
import { retryTitle } from './fixtures/data';

test("REQ-5.1: Open a question comment thread", async ({ page, browser }, info) => {
  const title=await createQuestion(browser,info,'question_creator',retryTitle);
  await entry(page);
  await openQuestion(page, title);
  await expect(region(post(page), 'Comments')).toBeVisible();
  await expect(action(region(post(page), 'Comments'), 'Add a comment')).toBeVisible();
});
