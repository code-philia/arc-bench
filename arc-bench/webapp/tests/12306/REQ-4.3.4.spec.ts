import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-4.3.4
// fixtures: profile_user

test('REQ-4.3.4: Save a new passenger type in the additional information section', async ({ page }) => {
  await h.openUserInformation(page);
  await h.clickNamed(page, 'Edit');
  await h.clickNamed(page, 'Save');
  await h.expectSuccessFeedback(page);
});
