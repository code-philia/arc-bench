// requirement: REQ-5.1
import { test, expect, entry, action, mainNav, region, openQuestion, post } from './helpers';
import { retryTitle } from './fixtures/data';

test("REQ-5.1: Open a question comment thread", async ({ page }) => {
  await entry(page);
  await openQuestion(page, retryTitle);
  await expect(region(post(page), 'Comments')).toBeVisible();
  await expect(action(region(post(page), 'Comments'), 'Add a comment')).toBeVisible();
});
