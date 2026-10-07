import { test, expect, entry, openQuestion, action, region, post } from './helpers';
import { body, retryTitle } from './fixtures/data';

// requirement: REQ-1.3

test('REQ-1.3: Read without an account', async ({ page, browser }, info) => {
  await entry(page); await openQuestion(page,retryTitle);
  await expect(page.getByRole('heading',{name:retryTitle,exact:true})).toBeVisible();
  await expect(post(page)).toContainText(body);
  for (const tag of ['node.js','http','retry']) await expect(action(post(page),tag)).toBeVisible();
  for (const name of ['Log in','Sign up']) await expect(action(page.getByRole('banner'),name)).toBeVisible();
  await expect(region(page,'Log in')).toHaveCount(0);
});
