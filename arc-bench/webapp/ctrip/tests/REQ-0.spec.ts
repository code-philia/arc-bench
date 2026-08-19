import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-0
// fixtures: public_homepage

test('REQ-0: Open System', async ({ page }) => {
  await h.openHome(page);
  await h.expectHome(page);
});
