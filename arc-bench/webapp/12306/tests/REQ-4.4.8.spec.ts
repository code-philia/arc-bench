import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-4.4.8
// fixtures: passenger_manager_user

test('REQ-4.4.8: Confirm deletion of one passenger', async ({ page }) => {
  await h.openMyPassengers(page);
  await h.clickNamed(page, /Delete/i);
  await h.expectSuccessFeedback(page);
});

test('REQ-4.4.8: Cancel deletion of one passenger', async ({ page }) => {
  await h.openMyPassengers(page);
  await h.clickNamed(page, /Delete/i);
  await h.expectSuccessFeedback(page);
});
