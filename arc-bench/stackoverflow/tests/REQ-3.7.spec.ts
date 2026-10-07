import { test, expect, login, activity, action, post, titleFor, composeQuestion } from './helpers';
import { body } from './fixtures/data';

// requirement: REQ-3.7

test('REQ-3.7: Follow an owned question to its detail', async ({ page, browser }, info) => {
  await login(page,'question_creator');
  const title=titleFor(info,'SO Activity Question Navigation'); await composeQuestion(page,title);
  const content=await activity(page,'Questions'); await action(content,title).click();
  await expect(page.getByRole('heading',{name:title,exact:true})).toBeVisible();
  await expect(post(page)).toContainText(body);
  for (const tag of ['node.js','http','retry']) await expect(action(post(page),tag)).toBeVisible();
});
