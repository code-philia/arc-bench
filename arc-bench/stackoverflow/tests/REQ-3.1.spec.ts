// requirement: REQ-3.1
import { test, expect, entry, action, mainNav, region, openQuestion, post, createQuestion } from './helpers';
import { retryTitle } from './fixtures/data';

test("REQ-3.1: Open public Questions listing", async ({ page, browser }, info) => {
  const title=await createQuestion(browser,info,'question_creator','A public retry question for discovery');
  await entry(page);
  await action(mainNav(page), 'Questions').click();
  await expect(region(page, 'Question feed')).toBeVisible();await expect(action(region(page,'Question feed'),title)).toBeVisible();
  await expect(action(region(page, 'Question feed'), 'Ask Question')).toBeVisible();
});
