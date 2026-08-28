import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-4.4.3
// fixtures: passenger_manager_user

test('REQ-4.4.3: Add a frequent passenger successfully', async ({ page }) => {
  await h.openMyPassengers(page);
  await h.clickNamed(page, 'Add new passengers');
  await h.fillPassengerForm(page);
  await h.clickNamed(page, 'Determine');
  await h.expectSuccessFeedback(page);
  await expect(page.getByRole('cell', { name: h.FIXTURES.newPassenger.name })).toBeVisible();
});
