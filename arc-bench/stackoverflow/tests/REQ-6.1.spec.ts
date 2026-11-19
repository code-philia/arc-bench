import { expectDisplayedTag, catalogPagination, test, expect, entry, action, region, mainNav, collection, createQuestion, createAnswer, displayTag, tagDescription, tagQuestionCount, asUser, openQuestion, post, field, verifySavedQuestion, confirmDeletion, expectPaginationEnd } from './helpers';
import { body, initialEnvironment, retryTitle } from './fixtures/data';

// requirement: REQ-6.1

test('REQ-6.1: Browse popular tags and python questions', async ({ page, browser }, info) => {
  await entry(page); await action(mainNav(page),'Tags').click();
  const catalog=region(page,'Tags');
  const countsBefore=new Map<string,number>(),descriptions=new Map<string,string>();
  for (const name of initialEnvironment.tags) {
   const tag=region(catalog,`Tag ${name}`);
   await expect(action(tag,name)).toBeVisible();
   const text=await tagDescription(tag);
   descriptions.set(name,text);countsBefore.set(name,await tagQuestionCount(tag));
  }
  const unanswered=await createQuestion(browser,info,'question_creator','An unanswered Python discovery question','python');
  const answered=await createQuestion(browser,info,'question_creator','An answered Python discovery question','python');
  await createAnswer(browser,answered);
  const control=await createQuestion(browser,info,'question_creator','A non-Python discovery control','node.js');
  await page.reload();
  for(const [name,before]of countsBefore){
   const tag=region(catalog,`Tag ${name}`);
   expect(await tagDescription(tag)).toBe(descriptions.get(name)!);
   expect(await tagQuestionCount(tag)).toBe(before+(name==='python'?2:name==='node.js'?1:0));
  }
  const counts: number[] = [];
  for (const tag of await collection(catalog,'Tag').all()) counts.push(await tagQuestionCount(tag));
  expect(counts.length).toBeGreaterThanOrEqual(5);
  expect(counts).toEqual([...counts].sort((a,b)=>b-a));
  await expectPaginationEnd(catalog,await catalogPagination(page,'Tags'));
  await action(mainNav(page),'Tags').click();
  await action(region(catalog,'Tag python'),'python').click();
  await expect(region(page,'Python tag')).toContainText(descriptions.get('python')!);
  await expect(region(page,'Related tags')).toBeVisible();
  const feed=region(page,'Question feed');
  await expect(action(feed,unanswered)).toBeVisible();
  await expect(action(feed,answered)).toBeVisible();
  await expect(action(feed,control)).toHaveCount(0);
  const summaries=collection(feed,'Question');
  expect(await summaries.count()).toBeGreaterThan(0);
  for (const summary of await summaries.all()) await expectDisplayedTag(summary,'python');
  await asUser(browser,'question_creator',async owner=>{
    await openQuestion(owner,answered);await action(post(owner),'Edit').click();
    await field(owner,'Tags').fill('javascript');await field(owner,'Edit Summary').fill('Corrected the language tag.');
    await action(owner,'Save edits').click();await verifySavedQuestion(owner,answered,body,'javascript');
  });
  await action(mainNav(page),'Tags').click();await page.reload();
  for(const [name,before]of countsBefore)expect(await tagQuestionCount(region(catalog,`Tag ${name}`))).toBe(before+(name==='python'||name==='javascript'||name==='node.js'?1:0));
  await asUser(browser,'question_creator',async owner=>{
    await openQuestion(owner,unanswered);await action(post(owner),'Delete question').click();await confirmDeletion(owner);
    await expect(region(owner,'Question feed')).toBeVisible();
  });
  await page.reload();
  for(const [name,before]of countsBefore)expect(await tagQuestionCount(region(catalog,`Tag ${name}`))).toBe(before+(name==='javascript'||name==='node.js'?1:0));
});
