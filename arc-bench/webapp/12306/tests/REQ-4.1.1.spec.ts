import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-4.1.1
// fixtures: registered_user, personal_center_user

test('REQ-4.1.1: Block personal center access for an unauthenticated user', async ({ page }) => {
  await h.openHome(page);
  await h.clickNamed(page, /my 12306/i);
  await h.expectLoginForm(page);
});
