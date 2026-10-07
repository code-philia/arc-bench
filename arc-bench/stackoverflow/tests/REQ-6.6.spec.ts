import { test, expect, entry, action, region, mainNav, post } from './helpers';
import { body } from './fixtures/data';

// requirement: REQ-6.6

test('REQ-6.6: Follow a python question from tag discovery', async ({ page, browser }, info) => {
  await entry(page); await action(mainNav(page),'Tags').click();
  await action(region(region(page,'Tags'),'Tag python'),'python').click();
  await action(region(page,'Question feed'),'SO Python Unanswered Recent').click();
  await expect(page.getByRole('heading',{name:'SO Python Unanswered Recent',exact:true})).toBeVisible();
  await expect(post(page)).toContainText(body); await expect(action(post(page),'python')).toBeVisible();
  await expect(action(page.getByRole('banner'),'Log in')).toBeVisible();
});
