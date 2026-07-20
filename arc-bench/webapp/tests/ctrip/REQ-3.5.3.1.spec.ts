import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-3.5.3.1
// fixtures: flight_search_home, flight_result_dataset

test('REQ-3.5.3.1: Combined Filters', async ({ page }) => {
  await h.openFlightResults(page);
  await h.clickIfVisible(page, [/筛选/, /filter/i]);
  await h.clickFirstAvailable(page, [[/直飞/, /nonstop/i]]);
  await h.clickFirstAvailable(page, [[/南方航空/, /China Southern/i]]);
  await h.expectAnyVisible(page, [[/直飞/, /nonstop/i], [/南方航空/, /China Southern/i]]);
});
