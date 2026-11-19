import { expectDisplayedTag,test, expect, login, openQuestion, action, field, region, post, createQuestion, asUser, expectBody, expectQuestionAbsent,entry } from './helpers';
import {createSearchControl} from './helpers';
import { body } from './fixtures/data';

// requirement: REQ-3.9

test('REQ-3.9: Read saved revision as another user', async ({ page, browser }, info) => {
  const control=await createSearchControl(browser,'question_editor');
  const title=await createQuestion(browser,info,'question_editor','SO Persisted Question Revision');
  await login(page,'question_editor'); await openQuestion(page,title); await action(post(page),'Edit').click();
  const revised=`${title} clarified`, text=`${body} Use a bounded retry budget.`;
  await field(page,'Title').fill(revised); await field(page,'Body').fill(text); await field(page,'Tags').fill('http,retry');
  await field(page,'Edit Summary').fill('Documented bounded retry budget.'); await action(page,'Save edits').click();
  await expect(page.getByRole('heading',{name:revised,exact:true})).toBeVisible();
  await asUser(browser,'stack_user',async visitor => {
   await openQuestion(visitor,revised); await visitor.reload(); await expectBody(post(visitor),text);
   for (const tag of ['http','retry']) await expectDisplayedTag(post(visitor),tag);
   await expectDisplayedTag(post(visitor),'node.js',0);
   await action(post(visitor),'Timeline').click();
   await expect(region(visitor,'Revision history')).toContainText('Documented bounded retry budget.');
   await entry(visitor);await expectQuestionAbsent(visitor,title,control);
  });
});
