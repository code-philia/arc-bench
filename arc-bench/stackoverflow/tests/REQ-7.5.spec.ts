import { acceptedAnswer, test, expect, login, activity, action, answer, prepareActivity, actorName } from './helpers';
import {  } from './fixtures/data';

// requirement: REQ-7.5

test('REQ-7.5: Follow an activity answer to its parent', async ({ page, browser }, info) => {
  const data=await prepareActivity(browser,info,{accepted:true});
  await login(page,'activity_user'); const content=await activity(page,'Answers');
  await action(content,data.reactTitle).click();
  await expect(page.getByRole('heading',{name:data.reactTitle,exact:true})).toBeVisible();
  await expect(answer(page,actorName('activity_user'))).toContainText(data.excerpt);
  await expect(acceptedAnswer(answer(page,actorName('activity_user')))).toBeVisible();
});
