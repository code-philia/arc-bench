import {test, expect, login, activity, action, field, region, post, output, titleFor, expectBody , expectNumeric, expectQuestionAbsent } from './helpers';
import { body } from './fixtures/data';

// requirement: REQ-3.3

test('REQ-3.3: Publish with preview and tags', async ({ page, browser }, info) => {
  await login(page,'question_creator');
  const title = titleFor(info,'How can I safely retry an idempotent HTTP request in Node.js without duplicating side effects?');
  await action(region(page,'Question feed'),'Ask Question').click();
  await field(page,'Title').fill(title);
  await expectNumeric(page,'Title character count',title.length);
  await field(page,'Body').fill(`**Retry safety**\n\n${body}`);
  await expect(region(page,'Preview').locator('strong,b').filter({hasText:'Retry safety'})).toHaveText('Retry safety');
  await expect(region(page,'Preview')).toContainText(body);
  await field(page,'Tags').fill('node.js');
  for (const tag of ['node.js','http','retry']) await expect(region(page,'Suggestions').getByText(tag,{exact:true})).toBeVisible();
  await field(page,'Tags').fill('node.js,http,retry');
  await action(page,'Post Your Question').click();
  await expect(page.getByRole('heading',{name:title,exact:true})).toBeVisible();
  await expectBody(post(page),body);
  await expect(post(page).locator('strong,b').filter({hasText:'Retry safety'})).toHaveText('Retry safety');
  for (const tag of ['node.js','http','retry']) await expect(action(post(page),tag)).toBeVisible();
  const content = await activity(page,'Questions');
  await expect(action(content,title)).toBeVisible();
});

test('REQ-3.3: Reject missing required fields', async ({ page, browser }, info) => {
  await login(page,'question_creator');
  await action(region(page,'Question feed'),'Ask Question').click();
  await action(page,'Post Your Question').click();
  await expect(page.getByText('Title is required (minimum 15 characters)',{exact:true})).toBeVisible();
  const rejectedTitle=titleFor(info,'How can I safely retry an HTTP request?');await field(page,'Title').fill(rejectedTitle);
  await action(page,'Post Your Question').click();
  await expect(page.getByText('Question body is required (minimum 220 characters)',{exact:true})).toBeVisible();
  await field(page,'Body').fill(body);
  await action(page,'Post Your Question').click();
  await expect(page.getByText('Please add at least one tag',{exact:true})).toBeVisible();
  await expect(field(page,'Title')).toBeVisible();
  await expect(post(page)).toHaveCount(0);
  await expectQuestionAbsent(page,rejectedTitle);
});

test('REQ-3.3: Validate title and body minimum lengths', async ({ page, browser }, info) => {
  await login(page,'question_creator');
  await action(region(page,'Question feed'),'Ask Question').click();
  const acceptedTitle=titleFor(info,'').trim().slice(0,15),shortTitle=acceptedTitle.slice(0,14);
  await field(page,'Title').fill(shortTitle);
  await field(page,'Body').fill(body);
  await field(page,'Tags').fill('http');
  await action(page,'Post Your Question').click();
  await expect(page.getByText('Title is required (minimum 15 characters)',{exact:true})).toBeVisible();
  const rejectedBodyTitle=titleFor(info,'How can I safely retry an HTTP request?');await field(page,'Title').fill(rejectedBodyTitle);
  await field(page,'Body').fill('a'.repeat(219));
  await action(page,'Post Your Question').click();
  await expect(page.getByText('Question body is required (minimum 220 characters)',{exact:true})).toBeVisible();
  await expect(field(page,'Body')).toBeVisible();
  await expect(post(page)).toHaveCount(0);
  await field(page,'Title').fill(acceptedTitle);await field(page,'Body').fill('a'.repeat(220));await action(page,'Post Your Question').click();
  await expect(page.getByRole('heading',{name:acceptedTitle,exact:true})).toBeVisible();await expectBody(post(page),'a'.repeat(220));
  await expectQuestionAbsent(page,shortTitle);await expectQuestionAbsent(page,rejectedBodyTitle);
});
