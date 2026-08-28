import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-4.4.1
// fixtures: passenger_manager_user

test('REQ-4.4.1: Open and view the my passengers page', async ({ page }) => {
  await h.openMyPassengers(page);
  await h.expectTextsVisible(page, ['All', 'Name', 'ID type', 'ID number', 'Mobile number', 'Operation']);
  const ownerRow = page.locator('tr').filter({ hasText: 'Passenger Manager' });
  await expect(ownerRow).toHaveCount(1);
  await expect(ownerRow.getByRole('button', { name: 'Delete', exact: true })).toHaveCount(0);
});
