import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-4.3.2
// fixtures: profile_user

test('REQ-4.3.2: Save valid edits in the essential information section', async ({ page }) => {
  await h.openUserInformation(page);
  await h.clickNamed(page, 'Edit');
  await h.selectRadio(page, 'Female');
  await h.fillField(page, 'Password', h.FIXTURES.profileUser.newPassword);
  await h.clickNamed(page, 'Save');
  await h.expectSuccessFeedback(page);
  await h.expectTextsVisible(page, ['Female']);
});

test('REQ-4.3.2: Reject an invalid password in the essential information section', async ({ page }) => {
  await h.resetTestDatabase(page);
  await h.openUserInformation(page);
  await h.clickNamed(page, 'Edit');
  await h.fillField(page, 'Password', 'bad');
  await h.clickNamed(page, 'Save');
  await h.expectErrorFeedback(page, 'Please enter a valid password.');
});
