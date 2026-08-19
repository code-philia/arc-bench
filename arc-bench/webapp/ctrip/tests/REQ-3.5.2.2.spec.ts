import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-3.5.2.2
// fixtures: flight_search_home, flight_result_dataset

test('REQ-3.5.2.2: View More Dates', async ({ page }) => {
  await h.openFlightResults(page);
  await h.clickFirstAvailable(page, [[/更多日期/, /view more dates/i, /calendar/i]]);
  await h.expectAnyVisible(page, [[/月/, /calendar/i, /价格趋势/, /price trend/i]]);
});
