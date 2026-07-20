import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-4.3.1
// fixtures: profile_user

test('REQ-4.3.1: Open and view the user information page', async ({ page }) => {
  await h.openUserInformation(page);
  await h.expectTextsVisible(page, ['Essential information', 'Contact information', 'Additional information', 'Account number', 'Name', 'Gender', 'Nationality', 'ID type', 'ID number', 'Email', 'Passenger type']);
});
