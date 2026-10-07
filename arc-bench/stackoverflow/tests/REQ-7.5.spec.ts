import { test, expect, login, activity, action, answer } from './helpers';
import {  } from './fixtures/data';

// requirement: REQ-7.5

test('REQ-7.5: Follow an activity answer to its parent', async ({ page, browser }, info) => {
  await login(page,'activity_user'); const content=await activity(page,'Answers');
  await action(content,'How does React state update?').click();
  await expect(page.getByRole('heading',{name:'How does React state update?',exact:true})).toBeVisible();
  await expect(answer(page,'Stack User')).toContainText('Batch state updates safely.');
  await expect(action(answer(page,'Stack User'),'Accepted answer')).toBeVisible();
});
