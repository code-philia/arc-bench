import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-2.6.2.2
// fixtures: public_homepage

test('REQ-2.6.2.2: Decline Registration Agreement', async ({ page }) => {
  await h.beginRegistrationFromLogin(page);
  await h.expectRegistrationAgreement(page);
  await h.cancelDialog(page);
  await h.expectHome(page);
});
