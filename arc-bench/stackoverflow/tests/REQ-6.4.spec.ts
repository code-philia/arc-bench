import {test, expect, entry, action, region, mainNav, beforeText, expectActive, createQuestion, createAnswer, asUser, openQuestion, post, field, verifySavedQuestion } from './helpers';
import { body } from './fixtures/data';

// requirement: REQ-6.4

test('REQ-6.4: Switch newest and active ordering', async ({ page, browser }, info) => {
  const older=await createQuestion(browser,info,'question_creator','An older Python question','python');
  await createAnswer(browser,older);
  const newer=await createQuestion(browser,info,'question_creator','A newer unanswered Python question','python');
  const other=await createQuestion(browser,info,'question_creator','An unrelated Node.js question','node.js');
  await asUser(browser,'question_creator',async author=>{
   await openQuestion(author,older);await action(post(author),'Edit').click();
   await field(author,'Body').fill(body+' This revision adds a retry deadline.');
   await field(author,'Edit Summary').fill('Added a retry deadline.');
   await action(author,'Save edits').click();
   await verifySavedQuestion(author,older,body+' This revision adds a retry deadline.','python');
  });
  await entry(page); await action(mainNav(page),'Questions').click();
  const feed=region(page,'Question feed');
  await action(feed,'Newest').click();
  await expectActive(action(feed,'Newest'),true);
  await beforeText(feed,newer,older);await expect(action(feed,other)).toBeVisible();
  await action(feed,'Active').click();
  await expectActive(action(feed,'Active'),true);
  await beforeText(feed,older,newer);await expect(action(feed,other)).toBeVisible();
});
