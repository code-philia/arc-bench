import { test, expect, entry, action, region } from './helpers';
import { retryTitle } from './fixtures/data';

// requirement: REQ-6.3

test('REQ-6.3: Suggest and search react state', async ({ page, browser }, info) => {
  await entry(page);
  const search=page.getByRole('banner').getByRole('searchbox',{name:'Search',exact:true});
  await search.fill('react state');
  await expect(action(region(page,'Search suggestions'),'How does React state update?')).toBeVisible();
  await search.press('Enter');
  await expect(action(region(page,'Search results'),'How does React state update?')).toBeVisible();
  for (const title of [retryTitle,'SO Python Unanswered Recent','SO Python Answered Active']) await expect(action(region(page,'Search results'),title)).toHaveCount(0);
});
