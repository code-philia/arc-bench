import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-3.5.3.4
// fixtures: flight_search_home, flight_result_dataset

test('REQ-3.5.3.4: Sort by Departure Time', async ({ page }) => {
  await h.openFlightResults(page);
  await h.clickFirstAvailable(page, [[/起飞时间/, /departure time/i]]);
  await h.expectVisible(page, [/起飞时间/, /departure time/i]);
});
