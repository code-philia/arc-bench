import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-4.3.3
// fixtures: profile_user

test('REQ-4.3.3: Save a new email address in the contact information section', async ({ page }) => {
  await h.openUserInformation(page);
  const section = page.locator('.panel').filter({ hasText: 'Contact information' });
  await section.getByRole('button', { name: 'Edit', exact: true }).click();
  await section.getByLabel('Email', { exact: true }).fill(h.FIXTURES.profileUser.newEmail);
  await section.getByRole('button', { name: 'Save', exact: true }).click();
  await h.expectSuccessFeedback(page);
  await h.expectTextsVisible(page, [h.FIXTURES.profileUser.newEmail]);
  await page.evaluate(() => localStorage.removeItem('train-user'));
  await page.goto('/login');
  await h.fillLoginForm(page, h.FIXTURES.profileUser.newEmail, h.FIXTURES.profileUser.password);
  await h.clickNamed(page, 'LOGIN');
  await expect(page.getByRole('button', { name: /sign out/i })).toBeVisible();
});
