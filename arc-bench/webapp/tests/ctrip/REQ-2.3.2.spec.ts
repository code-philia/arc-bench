import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-2.3.2
// fixtures: public_homepage

test('REQ-2.3.2: Switch to Verification-Code Login', async ({ page }) => {
  await h.ensureCodeLogin(page);
});
