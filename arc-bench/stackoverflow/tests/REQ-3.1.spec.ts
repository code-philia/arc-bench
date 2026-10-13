// requirement: REQ-3.1
import { test, expect, entry, action, mainNav, region, openQuestion, post } from './helpers';
import { retryTitle } from './fixtures/data';

test("REQ-3.1: Open public Questions listing", async ({ page }) => {
  await entry(page);
  await action(mainNav(page), 'Questions').click();
  await expect(region(page, 'Question feed')).toBeVisible();
  await expect(action(region(page, 'Question feed'), 'Ask Question')).toBeVisible();
});
