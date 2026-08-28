import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-4.4.11
// fixtures: passenger_manager_user

test('REQ-4.4.11: Clear the passenger search results', async ({ page }) => {
  await h.openMyPassengers(page);
  await h.fillField(page, 'Name', h.FIXTURES.passenger.name);
  await h.clickNamed(page, 'Search');
  await h.clickNamed(page, '×');
  await expect(page.getByLabel('Name')).toHaveValue('');
  await h.expectTextsVisible(page, ['Passenger Example', 'Delete Passenger One', 'Delete Passenger Two']);
});
