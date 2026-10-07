import { test, expect, login, openQuestion, action, region, mainNav, post, createQuestion, confirmDeletion } from './helpers';
import { retryTitle } from './fixtures/data';

// requirement: REQ-3.4

test('REQ-3.4: Confirm own question deletion', async ({ page, browser }, info) => {
  const title = await createQuestion(browser,info,'question_deleter','SO Deletable Question');
  await login(page,'question_deleter');
  await openQuestion(page,title);
  await action(post(page),'Delete').click();
  await confirmDeletion(page);
  await expect(region(page,'Question feed')).toBeVisible();
  await expect(action(region(page,'Question feed'),retryTitle)).toBeVisible();
  await action(mainNav(page),'Questions').click();
  await expect(action(region(page,'Question feed'),title)).toHaveCount(0);
  const search=page.getByRole('banner').getByRole('searchbox',{name:'Search',exact:true});
  await search.fill(title); await search.press('Enter');
  await expect(action(region(page,'Search results'),title)).toHaveCount(0);
});
