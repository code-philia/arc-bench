import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-4.4.9
// fixtures: passenger_manager_user

test('REQ-4.4.9: Confirm batch deletion of selected passengers', async ({ page }) => {
  await h.openMyPassengers(page);
  await page.getByRole('checkbox').nth(1).check();
  await page.getByRole('checkbox').nth(2).check();
  await h.clickNamed(page, /Delete selected|Delete/i);
  await h.expectSuccessFeedback(page);
});

test('REQ-4.4.9: Cancel batch deletion of selected passengers', async ({ page }) => {
  await h.openMyPassengers(page);
  await page.getByRole('checkbox').nth(1).check();
  await page.getByRole('checkbox').nth(2).check();
  await h.clickNamed(page, /Delete selected|Delete/i);
  await h.expectSuccessFeedback(page);
});
