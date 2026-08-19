import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-4.4.10
// fixtures: passenger_manager_user

test('REQ-4.4.10: Search the passenger list by a fuzzy condition', async ({ page }) => {
  await h.openMyPassengers(page);
  await h.fillField(page, 'Name', h.FIXTURES.passenger.name);
  await h.clickNamed(page, 'Search');
  await h.expectTextsVisible(page, [h.FIXTURES.passenger.name]);
});
