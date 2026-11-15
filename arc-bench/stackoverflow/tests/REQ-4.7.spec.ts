import { test, expect, entry, openQuestion, region, answer, output, beforeText, createSortableQuestion , expectNumeric } from './helpers';
import {  } from './fixtures/data';

// requirement: REQ-4.7

test('REQ-4.7: Switch to latest-modified answers', async ({ page, browser }, info) => {
  const title=await createSortableQuestion(browser,info);
  await entry(page); await openQuestion(page,title);
  const sort=page.getByRole('combobox',{name:'Sorted by',exact:true});
  await sort.selectOption({label:'Highest score'});
  await beforeText(region(page,'Answers'),'Highest score answer: use bounded retries.','Recent answer: log each retry attempt.');
  await sort.selectOption({label:'Date modified'});
  await beforeText(region(page,'Answers'),'Recent answer: log each retry attempt.','Highest score answer: use bounded retries.');
  await expectNumeric(page,'Answer count',2);
  await expect(page.getByRole('heading',{name:title,exact:true})).toBeVisible();
});
