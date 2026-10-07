import { test, expect, login, ownProfile, action, region, profileNav, answer, beforeText } from './helpers';
import {  } from './fixtures/data';

// requirement: REQ-7.1

test('REQ-7.1: Inspect reputation contributions', async ({ page, browser }, info) => {
  await login(page,'activity_user'); await ownProfile(page);
  await action(profileNav(page),'Reputation').click();
  const history=region(page,'Reputation history');
  for (const text of ['answer upvoted','question upvoted','+10','+5']) await expect(history).toContainText(text);
  for (const title of ['How does React state update?','SO Activity Owned Question']) await expect(action(history,title)).toBeVisible();
  await beforeText(history,'answer upvoted','question upvoted');
});
