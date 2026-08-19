import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-3.5.3.2
// fixtures: flight_search_home, flight_result_dataset

test('REQ-3.5.3.2: Sort by Price', async ({ page }) => {
  await h.openFlightResults(page);
  await h.clickFirstAvailable(page, [[/价格/, /price/i]]);
  await h.expectVisible(page, [/价格/, /price/i]);
});
