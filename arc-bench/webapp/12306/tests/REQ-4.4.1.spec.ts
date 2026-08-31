import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-4.4.1
// fixtures: passenger_manager_user

test('REQ-4.4.1: Open and view the my passengers page', async ({ page }) => {
  await h.openMyPassengers(page);
  await h.expectTextsVisible(page, ['All', 'Name', 'ID type', 'ID number', 'Mobile number', 'Operation']);
  const rows = page.getByRole('row');
  let ownerFound = false;
  for (let index = 0; index < await rows.count(); index += 1) {
    const checkbox = rows.nth(index).getByRole('checkbox');
    if (await checkbox.count() && await checkbox.first().isDisabled()) {
      ownerFound = true;
      await expect(rows.nth(index).getByRole('button', { name: 'Delete', exact: true })).toHaveCount(0);
    }
  }
  expect(ownerFound).toBeTruthy();
});
