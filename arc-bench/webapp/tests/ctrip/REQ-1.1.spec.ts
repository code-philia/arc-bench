import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-1.1
// fixtures: public_homepage

test('REQ-1.1: Open Homepage', async ({ page }) => {
  await h.openHome(page);
  await h.expectHome(page);
});
