import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-2.7
// fixtures: registered_user, editable_profile

test('REQ-2.7: Edit Profile Management', async ({ page }) => {
  await h.openProfile(page);
  await h.clickFirstAvailable(page, [[/edit profile/i]]);
  await h.expectTextsVisible(page, [/edit your profile/i, /display name/i, /about me/i]);
  await h.fillField(page, [/display name/i], h.FIXTURES.profile.updatedDisplayName);
  await h.fillField(page, [/location/i], h.FIXTURES.profile.location);
  await h.fillField(page, [/title/i], h.FIXTURES.profile.title);
  await h.fillMarkdownBody(page, h.FIXTURES.profile.about);
  await h.fillField(page, [/website/i], h.FIXTURES.profile.website);
  await h.fillField(page, [/github/i], h.FIXTURES.profile.github);
  await h.clickFirstAvailable(page, [[/save and copy changes to all public communities/i, /save/i]]);
  await h.expectTextsVisible(page, [/updated|success/i]);
});
