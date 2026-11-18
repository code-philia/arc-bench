import {expectPrivateVotesHidden} from './helpers';
import { acceptedAnswer, reputationContribution, upvoteDescription,test, expect, entry, login, ownProfile, activity, action, region, mainNav, profileNav, activityNav, answer, output, noUsableAction, expectCurrent, prepareActivity, actor, numeric, expectResponse, publicUserAction , expectNumeric, asUser, composeQuestion, titleFor, field, saveProfile,openQuestions,openMembers } from './helpers';
import {expectPublicMember} from './helpers';
import { retryTitle } from './fixtures/data';

// requirement: REQ-7.4

test('REQ-7.4: Navigate answers and questions activity', async ({ page, browser }, info) => {
  const data=await prepareActivity(browser,info,{accepted:true,reputation:true});
  await login(page,'activity_user'); await ownProfile(page); await action(profileNav(page),'Activity').click();
  for (const name of ['Summary','Answers','Questions','Tags','Articles','Badges','Following','Bounties','Reputation','All actions','Responses','Votes']) await expect(action(activityNav(page),name)).toBeVisible();
  await action(activityNav(page),'Answers').click();
  const content=region(page,'Activity content');
  await expectCurrent(action(activityNav(page),'Answers'));
  for (const name of ['Score','Activity','Newest','Next page']) await expect(action(content,name)).toBeVisible();
  await expect(action(content,data.reactTitle)).toBeVisible();
  await expect(content).toContainText(data.excerpt);
  await expect(acceptedAnswer(content)).toBeVisible();
  await action(activityNav(page),'Questions').click();
  await expectCurrent(action(activityNav(page),'Questions'));
  await expect(action(content,data.ownedTitle)).toBeVisible();
  for (const [name,value] of [['Score',String(data.questionScore)],['Answer count',String(data.answerCount)]]) await expectNumeric(content,name,Number(value));
  const views=await numeric(content,'View count');expect(views).toBeGreaterThanOrEqual(0);
  await page.reload();
  await action(activityNav(page),'Questions').click();
  expect(await numeric(region(page,'Activity content'),'View count')).toBeGreaterThanOrEqual(views);
});

test('REQ-7.4: Read responses and private votes', async ({ page, browser }, info) => {
  const data=await prepareActivity(browser,info,{responses:true,privateVote:true,reputation:true});
  await login(page,'activity_user'); const content=await activity(page,'Responses');
  await expectResponse(content,data.responseText,data.ownedTitle);
  await expectResponse(content,data.answerResponseText,data.reactTitle);
  await expect(content).not.toContainText(data.unrelatedResponseText);
  await action(activityNav(page),'Votes').click();
  await expect(content).toContainText(upvoteDescription);
  await expect(action(content,data.reactTitle)).toBeVisible();
  await action(activityNav(page),'Reputation').click();
  for(const [reason,title]of [['answer upvoted',data.reactTitle],['question upvoted',data.ownedTitle]])await expect(reputationContribution(content,reason,10,title)).toHaveCount(1);
});

test('REQ-7.4: Protect private voting history', async ({ page, browser }, info) => {
  const data=await prepareActivity(browser,info,{privateVote:true});
  const owner=actor('activity_user');
  const namesakeTitle=titleFor(info,'A separate question by a namesake');
  await asUser(browser,'stack_user',async other=>{
    await ownProfile(other);await action(other,'Edit profile').click();await field(other,'Display name').fill(owner.displayName);await saveProfile(other,owner.displayName);
    await openQuestions(other);await composeQuestion(other,namesakeTitle);
    await openMembers(other);await (await publicUserAction(other,owner,true,{ownedQuestion:data.ownedTitle,excludedQuestion:namesakeTitle})).click();
    await expectPublicMember(other,owner,{ownedQuestion:data.ownedTitle,excludedQuestion:namesakeTitle});
    await action(activityNav(other),'Summary').click();await expectCurrent(action(activityNav(other),'Summary'));
    await noUsableAction(activityNav(other),'Votes');
    await expectPrivateVotesHidden(region(other,'Activity content'),data.reactTitle);
  });
  await entry(page); await openMembers(page);
  await (await publicUserAction(page,owner,true,{ownedQuestion:data.ownedTitle,excludedQuestion:namesakeTitle})).click();
  await expectPublicMember(page,owner,{ownedQuestion:data.ownedTitle,excludedQuestion:namesakeTitle});
  await action(activityNav(page),'Summary').click();await expectCurrent(action(activityNav(page),'Summary'));
  await noUsableAction(activityNav(page),'Votes');
  await expectPrivateVotesHidden(region(page,'Activity content'),data.reactTitle);
  await expect(profileNav(page)).toBeVisible();
  await action(activityNav(page),'Questions').click();await expect(action(region(page,'Activity content'),data.ownedTitle)).toBeVisible();await expect(action(region(page,'Activity content'),namesakeTitle)).toHaveCount(0);
});
