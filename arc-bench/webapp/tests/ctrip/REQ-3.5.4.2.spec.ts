import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-3.5.4.2
// fixtures: flight_search_home, flight_result_dataset

test('REQ-3.5.4.2: Select a Fare and Book', async ({ page }) => {
  await h.openBookingPage(page);
});
