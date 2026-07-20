import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-4.3.3
// fixtures: profile_user

test('REQ-4.3.3: Save a new email address in the contact information section', async ({ page }) => {
  await h.openUserInformation(page);
  await h.clickNamed(page, 'Edit');
  await h.fillField(page, 'Email', h.FIXTURES.profileUser.newEmail);
  await h.clickNamed(page, 'Save');
  await h.expectSuccessFeedback(page);
});
