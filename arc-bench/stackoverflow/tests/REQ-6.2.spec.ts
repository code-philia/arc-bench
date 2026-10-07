import { test, expect, login, action, region, mainNav } from './helpers';
import {  } from './fixtures/data';

// requirement: REQ-6.2

test('REQ-6.2: Toggle python watch preference', async ({ page, browser }, info) => {
  await login(page,'tag_watcher');
  await action(mainNav(page),'Tags').click();
  await action(region(region(page,'Tags'),'Tag python'),'python').click();
  await action(region(page,'Python tag'),'Watch tag').click();
  await expect(action(region(page,'Python tag'),'Unwatch tag')).toBeVisible();
  await action(mainNav(page),'Questions').click(); await page.reload();
  await expect(action(region(page,'Watched tags'),'python')).toBeVisible();
  await action(region(page,'Watched tags'),'python').click();
  await action(region(page,'Python tag'),'Unwatch tag').click();
  await expect(action(region(page,'Python tag'),'Watch tag')).toBeVisible();
  await action(mainNav(page),'Questions').click();
  await expect(action(region(page,'Watched tags'),'python')).toHaveCount(0);
});
