import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-1.6.1
// fixtures: public_homepage

test('REQ-1.6.1: View Cart Count', async ({ page }) => {
  await h.openHome(page);
  await h.expectCartCount(page);
});
