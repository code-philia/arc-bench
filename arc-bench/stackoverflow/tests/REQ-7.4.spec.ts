import { test, expect, entry, login, ownProfile, activity, action, region, mainNav, profileNav, activityNav, answer, output, noUsableAction } from './helpers';
import { retryTitle } from './fixtures/data';

// requirement: REQ-7.4

test('REQ-7.4: Navigate answers and questions activity', async ({ page, browser }, info) => {
  await login(page,'activity_user'); await ownProfile(page); await action(profileNav(page),'Activity').click();
  for (const name of ['Summary','Answers','Questions','Tags','Articles','Badges','Following','Bounties','Reputation','All actions','Responses','Votes']) await expect(action(activityNav(page),name)).toBeVisible();
  await action(activityNav(page),'Answers').click();
  const content=region(page,'Activity content');
  await expect(action(activityNav(page),'Answers')).toHaveAttribute('aria-current','page');
  for (const name of ['Score','Activity','Newest','Next page']) await expect(action(content,name)).toBeVisible();
  await expect(action(content,'How does React state update?')).toBeVisible();
  await expect(content).toContainText('Batch state updates safely.');
  await expect(content.getByText('Accepted answer',{exact:true})).toBeVisible();
  await action(activityNav(page),'Questions').click();
  await expect(action(activityNav(page),'Questions')).toHaveAttribute('aria-current','page');
  await expect(action(content,'SO Activity Owned Question')).toBeVisible();
  for (const [name,value] of [['Score','3'],['Answer count','1'],['View count','11']]) await expect(output(content,name)).toHaveText(value);
});

test('REQ-7.4: Read responses and private votes', async ({ page, browser }, info) => {
  await login(page,'activity_user'); const content=await activity(page,'Responses');
  await expect(content).toContainText('Check the state updater callback.');
  await expect(action(content,'How does React state update?')).toBeVisible();
  await action(activityNav(page),'Votes').click();
  await expect(content).toContainText(/upvote/i);
  await expect(action(content,retryTitle)).toBeVisible();
  await action(activityNav(page),'Reputation').click();
  for (const text of ['answer upvoted','question upvoted','+10','+5']) await expect(content).toContainText(text);
});

test('REQ-7.4: Protect private voting history', async ({ page, browser }, info) => {
  await entry(page); await action(mainNav(page),'Users').click();
  await action(region(page,'Users'),'Stack User activity_user@example.com').click();
  await action(profileNav(page),'Activity').click();
  await noUsableAction(activityNav(page),'Votes');
  await expect(region(page,'Activity content')).not.toContainText(retryTitle);
  await expect(profileNav(page)).toBeVisible();
});
