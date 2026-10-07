import { test, expect, login, openQuestion, action, field, region, post, createQuestion } from './helpers';
import { body } from './fixtures/data';

// requirement: REQ-3.3

test('REQ-3.3: Preview and cancel a question revision', async ({ page, browser }, info) => {
  const title = await createQuestion(browser,info,'question_editor','SO Question Edit Preview');
  await login(page,'question_editor');
  await openQuestion(page,title);
  await action(post(page),'Edit').click();
  await expect(field(page,'Title')).toHaveValue(title);
  await expect(field(page,'Body')).toHaveValue(body);
  await expect(field(page,'Tags')).toHaveValue('node.js,http,retry');
  await field(page,'Title').fill(`${title} clarified`);
  await field(page,'Tags').fill('http,retry');
  await expect(field(page,'Title')).toHaveValue(`${title} clarified`);
  await expect(field(page,'Tags')).toHaveValue('http,retry');
  await field(page,'Body').fill(body);
  await field(page,'Body').selectText();
  for (const name of ['Bold','Italic','Code']) await expect(action(page,name)).toBeVisible();
  await action(page,'Bold').click();
  await expect(region(page,'Preview')).toContainText(body);
  await expect(field(page,'Body')).not.toHaveValue(body);
  await expect(region(page,'How to Edit')).toContainText(/edit|clar|improv/i);
  await expect(page.getByRole('combobox',{name:'Rev',exact:true})).toBeVisible();
  await action(page,'Cancel').click();
  await expect(page.getByRole('heading',{name:title,exact:true})).toBeVisible();
  await expect(post(page)).toContainText(body);
  for (const tag of ['node.js','http','retry']) await expect(action(post(page),tag)).toBeVisible();
});

test('REQ-3.3: Save revision and summary', async ({ page, browser }, info) => {
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
