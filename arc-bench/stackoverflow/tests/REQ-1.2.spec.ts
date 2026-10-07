import { test, expect, entry, action, region, mainNav } from './helpers';
import {  } from './fixtures/data';

// requirement: REQ-1.2

test('REQ-1.2: Open major community sections', async ({ page, browser }, info) => {
  await entry(page);
  for (const [name, content] of [['Questions','Question feed'],['Tags','Tags'],['Users','Users'],['Home','Question feed']]) {
    await action(mainNav(page), name).click();
    await expect(action(mainNav(page), name)).toHaveAttribute('aria-current', 'page');
    await expect(region(page, content)).toBeVisible();
  }
  await expect(action(region(page,'Question feed'),'Next page')).toBeVisible();
  await action(mainNav(page), 'Users').click();
  await expect(region(page, 'Users')).toContainText('Helpful User');
  await expect(region(page, 'Users')).toContainText('Stack User');
});
