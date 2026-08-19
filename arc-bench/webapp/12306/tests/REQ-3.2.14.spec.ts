import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-3.2.14
// fixtures: searchable_routes, search_results_dataset

test('REQ-3.2.14: Enter the results page from the navigation dropdown', async ({ page }) => {
  await h.openHome(page);
  await h.clickNamed(page, /Booking/i);
  await h.assertResultsPage(page);
});
