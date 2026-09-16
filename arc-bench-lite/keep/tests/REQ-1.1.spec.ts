import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-1.1
// fixtures: public_homepage

test('REQ-1.1: Enter Website', async ({ page }) => {
  await h.openHome(page);
  await h.expectHomePage(page);
});
