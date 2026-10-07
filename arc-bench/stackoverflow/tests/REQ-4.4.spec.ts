import { test, expect, entry, openQuestion, region, answer, output, beforeText } from './helpers';
import {  } from './fixtures/data';

// requirement: REQ-4.4

test('REQ-4.4: Select highest-score ordering', async ({ page, browser }, info) => {
  await entry(page); await openQuestion(page,'SO Answer Sorting Question');
  const sort=page.getByRole('combobox',{name:'Sorted by',exact:true});
  await expect(sort.getByRole('option')).toHaveText(['Highest score','Trending','Date modified']);
  await beforeText(region(page,'Answers'),'Recent answer: log each retry attempt.','Highest score answer: use bounded retries.');
  await sort.selectOption({label:'Highest score'});
  await expect(output(page,'Answer count')).toHaveText('2');
  await beforeText(region(page,'Answers'),'Highest score answer: use bounded retries.','Recent answer: log each retry attempt.');
});
