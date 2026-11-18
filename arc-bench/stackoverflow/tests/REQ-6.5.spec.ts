import {selectChoice,expectChoice,setSwitch,expectSwitch,selectionDialog} from './helpers';
import { expectDisplayedTag,test, expect, login, action, field, region, mainNav, output, titleFor, expectField, collection, createQuestion, createAnswer , expectNumeric, displayTag, beforeText } from './helpers';
import { retryTitle } from './fixtures/data';

// requirement: REQ-6.5

test('REQ-6.5: Save and reapply python unanswered criteria', async ({ page, browser }, info) => {
  const matching=await createQuestion(browser,info,'question_creator','An unanswered Python question','python');
  const newer=await createQuestion(browser,info,'question_creator','A newer unanswered Python question','python');
  const answered=await createQuestion(browser,info,'question_creator','An answered Python control question','python');
  await createAnswer(browser,answered);
  const other=await createQuestion(browser,info,'question_creator','A non-Python control question','node.js');
  await login(page,'filter_user'); await action(mainNav(page),'Questions').click();
  await action(page,'Filter').click();
  const panel=region(page,'Filter panel');
  await setSwitch(panel,'Unanswered',true);
  await selectChoice(panel,'Sort','Newest');
  await field(panel,'Tags').fill('python');
  await expectSwitch(panel,'Unanswered',true);
  await expectChoice(panel,'Sort','Newest');
  await expectField(field(panel,'Tags'),'python');
  await action(panel,'Save custom filter').click();
  const dialog=selectionDialog(page);
  await expect(dialog).toBeVisible();
  const name=titleFor(info,'Python unanswered filter');
  await field(dialog,'Filter title').fill(name); await action(dialog,'Save filter').click();
  const assertResults=async () => {
   const feed=region(page,'Question feed');
   await expect(action(region(feed,`Question ${matching}`),matching)).toBeVisible();
   await expect(action(feed,newer)).toBeVisible();await beforeText(feed,newer,matching);
   for (const title of [answered,other]) await expect(action(feed,title)).toHaveCount(0);
   const summaries=collection(feed,'Question');
   expect(await summaries.count()).toBeGreaterThan(0);
   for (const summary of await summaries.all()) {
    await expectDisplayedTag(summary,'python');
    await expectNumeric(summary,'Answer count',0);
   }
  };
  await assertResults();
  await action(mainNav(page),'Home').click(); await page.reload();
  await action(region(page,'Saved filters'),name).click();
  await assertResults();
  await action(page,'Filter').click();
  await expectSwitch(panel,'Unanswered',true);
  await expectField(field(panel,'Tags'),'python');
  await expectChoice(panel,'Sort','Newest');
});
