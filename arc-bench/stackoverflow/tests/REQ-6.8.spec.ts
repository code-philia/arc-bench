import { test, expect, login, action, region, mainNav, asUser } from './helpers';
import {  } from './fixtures/data';

// requirement: REQ-6.8

test('REQ-6.8: Isolate tag watch preferences', async ({ page, browser }, info) => {
  await login(page,'tag_watcher'); await action(mainNav(page),'Tags').click();
  await action(region(region(page,'Tags'),'Tag python'),'python').click(); await action(region(page,'Python tag'),'Watch tag').click();
  await expect(action(region(page,'Python tag'),'Unwatch tag')).toBeVisible();
  await asUser(browser,'stack_user',async other => {
   await action(mainNav(other),'Questions').click(); await expect(action(region(other,'Watched tags'),'python')).toHaveCount(0);
   await action(mainNav(other),'Tags').click(); await action(region(region(other,'Tags'),'Tag python'),'python').click();
   await expect(action(region(other,'Python tag'),'Watch tag')).toBeVisible(); await expect(action(region(other,'Python tag'),'Unwatch tag')).toHaveCount(0);
  });
  await expect(action(region(page,'Python tag'),'Unwatch tag')).toBeVisible(); await action(region(page,'Python tag'),'Unwatch tag').click();
  await expect(action(region(page,'Python tag'),'Watch tag')).toBeVisible();
});
