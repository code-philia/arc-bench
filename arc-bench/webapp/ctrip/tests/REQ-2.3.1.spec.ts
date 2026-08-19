import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-2.3.1
// fixtures: public_homepage

test('REQ-2.3.1: Enter Login Page', async ({ page }) => {
  await h.ensurePasswordLogin(page);
});
