import { searchField, test, expect, entry, action, region, createQuestion, suffix, actorName, output, utcDatePattern, openQuestion } from './helpers';
import { retryTitle } from './fixtures/data';

// requirement: REQ-6.3

test('REQ-6.3: Suggest and search react state', async ({ page, browser }, info) => {
  const query=`React state ${suffix(info)}`;
  const started=Date.now();const title=await createQuestion(browser,info,'question_creator',query);const finished=Date.now();
  const controls=[await createQuestion(browser,info,'question_creator','A retry control question'),await createQuestion(browser,info,'question_creator','A Python control question','python')];
  await entry(page);
  const search=searchField(page);
  await search.fill(query);
  await expect(action(region(page,'Search suggestions'),title)).toBeVisible();
  await search.press('Enter');
  await expect(action(region(page,'Search results'),title)).toBeVisible();
  for (const title of controls) await expect(action(region(page,'Search results'),title)).toHaveCount(0);
  await action(region(page,'Search results'),title).click();await expect(page.getByRole('heading',{name:title,exact:true})).toBeVisible();
  await expect(output(page,'Asked')).toContainText(utcDatePattern(started,finished));
  const askedText=await output(page,'Asked').innerText();
  const possibleDays=[...new Set([started,finished].map(time=>new Date(time).toISOString().slice(0,10)))];
  const matchingDays=possibleDays.filter(day=>utcDatePattern(Date.parse(day),Date.parse(day)).test(askedText));expect(matchingDays).toHaveLength(1);
  const day=matchingDays[0],tomorrow=new Date(Date.parse(day)+86400000).toISOString().slice(0,10);
  const otherTag=await createQuestion(browser,info,'question_creator',query+' about Python','python');
  const otherAuthor=await createQuestion(browser,info,'question_editor',query+' by another author','node.js');
  await search.fill(`${query} [node.js] user:"${actorName('question_creator')}" created:${day}`);await search.press('Enter');
  await expect(action(region(page,'Search results'),title)).toBeVisible();
  for(const other of [...controls,otherTag,otherAuthor])await expect(action(region(page,'Search results'),other)).toHaveCount(0);
  await search.fill(`${query} [node.js] user:"${actorName('question_creator')}" created:${tomorrow}`);await search.press('Enter');
  for(const item of [title,...controls,otherTag,otherAuthor])await expect(action(region(page,'Search results'),item)).toHaveCount(0);
});
