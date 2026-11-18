import {selectChoice,expectChoiceOptions} from './helpers';
import { test, expect, entry, openQuestion, region, answer, output, beforeText, createSortableQuestion , expectNumeric } from './helpers';
import {  } from './fixtures/data';

// requirement: REQ-4.4

test('REQ-4.4: Select highest-score ordering', async ({ page, browser }, info) => {
  const title=await createSortableQuestion(browser,info);
  await entry(page); await openQuestion(page,title);
  await expectChoiceOptions(page,'Sorted by',['Highest score','Trending','Date modified']);
  await beforeText(region(page,'Answers'),'Recent answer: log each retry attempt.','Highest score answer: use bounded retries.');
  await selectChoice(page,'Sorted by','Highest score');
  await expectNumeric(page,'Answer count',2);
  await beforeText(region(page,'Answers'),'Highest score answer: use bounded retries.','Recent answer: log each retry attempt.');
});
