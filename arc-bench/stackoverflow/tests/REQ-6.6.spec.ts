import { pageBanner, expectDisplayedTag,test, expect, entry, action, region, mainNav, post, expectBody, createQuestion } from './helpers';
import { body } from './fixtures/data';

// requirement: REQ-6.6

test('REQ-6.6: Follow a python question from tag discovery', async ({ page, browser }, info) => {
  const title=await createQuestion(browser,info,'question_creator','A Python question discovered through its tag','python');
  await entry(page); await action(mainNav(page),'Tags').click();
  await action(region(region(page,'Tags'),'Tag python'),'python').click();
  await action(region(page,'Question feed'),title).click();
  await expect(page.getByRole('heading',{name:title,exact:true})).toBeVisible();
  await expectBody(post(page),body); await expectDisplayedTag(post(page),'python');
  await expect(action(pageBanner(page),'Log in')).toBeVisible();
});
