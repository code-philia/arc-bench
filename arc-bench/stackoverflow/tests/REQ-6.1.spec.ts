import { test, expect, entry, action, region, mainNav, numeric } from './helpers';
import { retryTitle } from './fixtures/data';

// requirement: REQ-6.1

test('REQ-6.1: Browse popular tags and python questions', async ({ page, browser }, info) => {
  await entry(page); await action(mainNav(page),'Tags').click();
  const catalog=region(page,'Tags');
  for (const [name,count] of [['python',20],['javascript',15],['node.js',10],['http',8],['retry',5]] as const) {
   const tag=region(catalog,`Tag ${name}`);
   await expect(action(tag,name)).toBeVisible();
   await expect(tag).toContainText(`${name} programming questions`);
   expect(await numeric(tag,'Question count')).toBeGreaterThanOrEqual(count);
  }
  const counts: number[] = [];
  for (const tag of await catalog.getByRole('region',{name:/^Tag /}).all()) counts.push(await numeric(tag,'Question count'));
  expect(counts.length).toBeGreaterThanOrEqual(5);
  expect(counts).toEqual([...counts].sort((a,b)=>b-a));
  await expect(action(catalog,'Next page')).toBeVisible();
  await action(region(catalog,'Tag python'),'python').click();
  await expect(region(page,'Python tag')).toContainText('python programming questions');
  await expect(region(page,'Related tags')).toBeVisible();
  const feed=region(page,'Question feed');
  await expect(action(feed,'SO Python Unanswered Recent')).toBeVisible();
  await expect(action(feed,'SO Python Answered Active')).toBeVisible();
  await expect(action(feed,retryTitle)).toHaveCount(0);
  const summaries=feed.getByRole('region',{name:/^Question /});
  expect(await summaries.count()).toBeGreaterThan(0);
  for (const summary of await summaries.all()) await expect(action(summary,'python')).toBeVisible();
});
