import {test, expect, login, openQuestion, action, field, region, post, createQuestion, expectBody, expectQuestionAbsent, expectField, readField, verifySavedQuestion, expectTagField, editGuidance, inspectOriginalRevision } from './helpers';
import { body } from './fixtures/data';

test('REQ-3.4: Save revision and summary', async ({ page, browser }, info) => {
  const title = await createQuestion(browser,info,'question_editor','SO Question Edit Save');
  await login(page,'question_editor');
  await openQuestion(page,title);
  await action(post(page),'Edit question').click();
  for(const [name,value]of [['Title',title],['Body',body],['Tags','node.js,http,retry']])if(name==='Tags')await expectTagField(field(page,name),value);else await expectField(field(page,name),value);
  for(const name of ['Bold','Italic','Code'])await expect(action(page,name)).toBeVisible();
  await expect(region(page,'Preview')).toBeVisible();await expect(editGuidance(page)).not.toHaveCount(0);
  await expect(field(page,'Rev')).toBeVisible();
  for(const [name,pattern,selector]of [['Bold',/^(\*\*|__)[\s\S]+\1$/,'strong,b'],['Italic',/^(\*|_)[\s\S]+\1$/,'em,i'],['Code',/^`[\s\S]+`$/,'code']] as const){
    await field(page,'Body').fill(body);await field(page,'Body').press('ControlOrMeta+a');await action(page,name).click();
    expect(await readField(field(page,'Body'))).toMatch(pattern);
    await expect(region(page,'Preview').locator(selector).filter({hasText:body})).toBeVisible();
  }
  await field(page,'Title').fill(title+' unsaved');await field(page,'Body').fill(body+' Unsaved draft.');await field(page,'Tags').fill('python');
  await field(page,'Edit Summary').fill('Unsaved retry draft.');
  await action(page,'Cancel').click();await verifySavedQuestion(page,title,body,'node.js,http,retry');
  await action(post(page),'Edit question').click();
  const newTitle = `${title} clarified`, newBody = `${body} Include bounded retry budgets.`;
  await field(page,'Title').fill(newTitle);
  await field(page,'Body').fill(newBody);
  await field(page,'Tags').fill('http,retry');
  await expect(region(page,'Preview')).toContainText(newBody);
  await field(page,'Edit Summary').fill('Fixed a typo in the second paragraph');
  await action(page,'Save edits').click();
  await expect(page.getByRole('heading',{name:newTitle,exact:true})).toBeVisible();
  await expectBody(post(page),newBody);
  await expect(post(page)).toContainText(/edited/i);
  await expect(action(post(page),'node.js')).toHaveCount(0);
  for (const tag of ['http','retry']) await expect(action(post(page),tag)).toBeVisible();
  await action(post(page),'Timeline').click();
  const history=region(page,'Revision history');
  await expect(history).toContainText('Fixed a typo in the second paragraph');
  await expect(history).toContainText(body);
  await expect(history).toContainText(newBody);await expect(history).not.toContainText('Unsaved retry draft.');
  await expectQuestionAbsent(page,title);
  await openQuestion(page,newTitle);
  await page.reload();
  await expectBody(post(page),newBody);
  await action(post(page),'Edit question').click();
  for(const [name,value]of [['Title',newTitle],['Body',newBody],['Tags','http,retry']])if(name==='Tags')await expectTagField(field(page,name),value);else await expectField(field(page,name),value);
  await inspectOriginalRevision(page,body);
  await action(page,'Cancel').click();await verifySavedQuestion(page,newTitle,newBody,'http,retry');
});
