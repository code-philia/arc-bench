import { test, expect, login, openQuestion, action, field, region, post, createQuestion, asUser } from './helpers';
import { body } from './fixtures/data';

// requirement: REQ-3.8

test('REQ-3.8: Read saved revision as another user', async ({ page, browser }, info) => {
  const title=await createQuestion(browser,info,'question_editor','SO Persisted Question Revision');
  await login(page,'question_editor'); await openQuestion(page,title); await action(post(page),'Edit').click();
  const revised=`${title} clarified`, text=`${body} Use a bounded retry budget.`;
  await field(page,'Title').fill(revised); await field(page,'Body').fill(text); await field(page,'Tags').fill('http,retry');
  await field(page,'Edit Summary').fill('Documented bounded retry budget.'); await action(page,'Save edits').click();
  await expect(page.getByRole('heading',{name:revised,exact:true})).toBeVisible();
  await asUser(browser,'stack_user',async visitor => {
   await openQuestion(visitor,revised); await visitor.reload(); await expect(post(visitor)).toContainText(text);
   for (const tag of ['http','retry']) await expect(action(post(visitor),tag)).toBeVisible();
   await expect(action(post(visitor),'node.js')).toHaveCount(0);
   await action(post(visitor),'Timeline').click();
   await expect(region(visitor,'Revision history')).toContainText('Documented bounded retry budget.');
  });
});
