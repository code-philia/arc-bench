import { test, expect, login, ownProfile, region, output } from './helpers';
import {  } from './fixtures/data';

// requirement: REQ-7.2

test('REQ-7.2: Display seeded Teacher achievement', async ({ page, browser }, info) => {
  await login(page,'badge_user'); await ownProfile(page);
  await expect(region(page,'Badges')).toContainText('Teacher');
  await expect(output(page,'badge notification')).toContainText('Teacher');
  await expect(output(page,'badge notification')).toContainText(/earned|award/i);
});
