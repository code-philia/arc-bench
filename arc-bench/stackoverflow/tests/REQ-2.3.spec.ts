import { test, expect, login, ownProfile, activity, action, region, profileNav, activityNav, output } from './helpers';
import {  } from './fixtures/data';

// requirement: REQ-2.3

test('REQ-2.3: View personal summary', async ({ page, browser }, info) => {
  await login(page,'stack_user');
  await ownProfile(page);
  await expect(action(profileNav(page),'Activity')).toBeVisible();
  await expect(action(activityNav(page),'Summary')).toHaveAttribute('aria-current','page');
  await expect(output(page,'Reputation')).toHaveText(/\d+/);
  await expect(region(page,'Badges')).toBeVisible();
  await expect(region(page,'Recent activity')).toBeVisible();
});
