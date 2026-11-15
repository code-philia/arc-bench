import { beforeRecords, reputationContribution, test, expect, login, ownProfile, action, region, profileNav, answer, beforeText, prepareActivity } from './helpers';
import {  } from './fixtures/data';

// requirement: REQ-7.1

test('REQ-7.1: Inspect reputation contributions', async ({ page, browser }, info) => {
  const data=await prepareActivity(browser,info,{reputation:true});
  await login(page,'activity_user'); await ownProfile(page);
  await action(profileNav(page),'Reputation').click();
  const history=region(page,'Reputation history');
  for (const text of ['answer upvoted','question upvoted','+10']) await expect(history).toContainText(text);
  for (const title of [data.reactTitle,data.ownedTitle]) await expect(action(history,title)).toBeVisible();
  await beforeRecords(reputationContribution(history,'answer upvoted',10,data.reactTitle),reputationContribution(history,'question upvoted',10,data.ownedTitle));
});
