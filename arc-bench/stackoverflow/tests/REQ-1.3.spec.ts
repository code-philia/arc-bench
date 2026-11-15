import {test, expect, entry, openQuestion, action, region, post, expectBody, createQuestion, createAnswer, answer, displayTag } from './helpers';
import { body, retryTitle } from './fixtures/data';

// requirement: REQ-1.3

test('REQ-1.3: Read without an account', async ({ page, browser }, info) => {
  const title=await createQuestion(browser,info,'question_creator',retryTitle);
  await createAnswer(browser,title);
  await entry(page); await openQuestion(page,title);
  await expect(page.getByRole('heading',{name:title,exact:true})).toBeVisible();
  await expect(answer(page)).toBeVisible();
  await expectBody(post(page),body);
  for (const tag of ['node.js','http','retry']) await expect(displayTag(post(page),tag)).toBeVisible();
  for (const name of ['Log in','Sign up']) await expect(action(page.getByRole('banner'),name)).toBeVisible();
  await expect(region(page,'Log in')).toHaveCount(0);
});
