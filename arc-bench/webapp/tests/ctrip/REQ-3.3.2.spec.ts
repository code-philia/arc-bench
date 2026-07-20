import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-3.3.2
// fixtures: flight_search_home

test('REQ-3.3.2: Filter by Cabin Class', async ({ page }) => {
  await h.openFlightSearch(page);
  await h.chooseOption(page, [/不限舱等/, /舱等/, /cabin/i], [/经济舱/, /economy/i]);
  await h.expectVisible(page, [/经济舱/, /economy/i]);
});
