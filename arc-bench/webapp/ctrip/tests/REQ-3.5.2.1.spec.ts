import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-3.5.2.1
// fixtures: flight_search_home, flight_result_dataset

test('REQ-3.5.2.1: Switch to a Nearby Date', async ({ page }) => {
  await h.openFlightResults(page);
  await h.clickFirstAvailable(page, [[/次日/, /附近日期/, /next day/i], [h.FIXTURES.flightSearch.nearbyDate]]);
  await h.expectFlightResults(page);
});
