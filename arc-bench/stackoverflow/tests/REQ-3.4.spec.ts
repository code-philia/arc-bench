import { test, expect, login, openQuestion, action, field, region, post, createQuestion } from './helpers';
import { body } from './fixtures/data';

test('REQ-3.4: Save revision and summary', async ({ page, browser }, info) => {
  const title = await createQuestion(browser,info,'question_editor','SO Question Edit Save');
  await login(page,'question_editor');
  await openQuestion(page,title);
  await action(post(page),'Edit').click();
  const newTitle = `${title} clarified`, newBody = `${body} Include bounded retry budgets.`;
  await field(page,'Title').fill(newTitle);
  await field(page,'Body').fill(newBody);
  await field(page,'Tags').fill('http,retry');
  await field(page,'Edit Summary').fill('Fixed a typo in the second paragraph');
  await action(page,'Save edits').click();
  await expect(page.getByRole('heading',{name:newTitle,exact:true})).toBeVisible();
  await expect(post(page)).toContainText(newBody);
  await expect(post(page)).toContainText(/edited/i);
  await expect(action(post(page),'node.js')).toHaveCount(0);
  for (const tag of ['http','retry']) await expect(action(post(page),tag)).toBeVisible();
  await action(post(page),'Timeline').click();
  const history=region(page,'Revision history');
  await expect(history).toContainText('Fixed a typo in the second paragraph');
  await expect(history).toContainText(body);
  await expect(history).toContainText(newBody);
});
