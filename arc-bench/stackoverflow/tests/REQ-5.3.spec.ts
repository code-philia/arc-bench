import { test, expect, entry, openQuestion, action, region, post, comment, beforeText, expectComments, createQuestion, asUser, publishComment } from './helpers';
import {  } from './fixtures/data';

// requirement: REQ-5.3

test('REQ-5.3: Reveal the complete comment thread', async ({ page, browser }, info) => {
  const title=await createQuestion(browser,info,'question_creator','SO Expanded Comment Question');
  await asUser(browser,'helpful_user',async author=>{
    await openQuestion(author,title);
    for(let i=1;i<=7;i++) await publishComment(post(author),`Retry discussion comment ${i}`);
  });
  await entry(page); await openQuestion(page,title);
  for (let i=1;i<=5;i++) await expect(comment(post(page),`Retry discussion comment ${i}`)).toBeVisible();
  for (let i=6;i<=7;i++) await expect(comment(post(page),`Retry discussion comment ${i}`)).not.toBeVisible();
  await expectComments(region(post(page),'Comments'),Array.from({length:5},(_,i)=>`Retry discussion comment ${i+1}`));
  await action(region(post(page),'Comments'),'Show 2 more comments').click();
  for (let i=1;i<=7;i++) await expect(comment(post(page),`Retry discussion comment ${i}`)).toBeVisible();
  await expectComments(region(post(page),'Comments'),Array.from({length:7},(_,i)=>`Retry discussion comment ${i+1}`));
  for (let i=1;i<7;i++) await beforeText(region(post(page),'Comments'),`Retry discussion comment ${i}`,`Retry discussion comment ${i+1}`);
});
