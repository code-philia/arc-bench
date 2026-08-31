import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-4.3.3
// fixtures: profile_contact_user

test('REQ-4.3.3: Save a new email address in the contact information section', async ({ page }) => {
  await h.openUserInformation(page, h.FIXTURES.profileContactUser);
  const section = page.getByRole('region', { name: 'Contact information' });
  await section.getByRole('button', { name: 'Edit', exact: true }).click();
  await section.getByLabel('Email', { exact: true }).fill(h.FIXTURES.profileContactUser.newEmail);
  await section.getByRole('button', { name: 'Save', exact: true }).click();
  await h.expectSuccessFeedback(page);
  await h.expectTextsVisible(page, [h.FIXTURES.profileContactUser.newEmail]);
  await h.signOutAndOpenLogin(page);
  await h.fillLoginForm(page, h.FIXTURES.profileContactUser.newEmail, h.FIXTURES.profileContactUser.password);
  await h.clickNamed(page, 'LOGIN');
  await expect(page.getByRole('button', { name: /sign out/i })).toBeVisible();
});
