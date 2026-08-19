import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-2.2
// fixtures: public_homepage

test('REQ-2.2: Open Login Entry', async ({ page }) => {
  await h.ensurePasswordLogin(page);
});
