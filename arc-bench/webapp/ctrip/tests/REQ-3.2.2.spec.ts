import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-3.2.2
// fixtures: flight_search_home

test('REQ-3.2.2: Swap Origin and Destination', async ({ page }) => {
  await h.openFlightSearch(page);
  await h.fillField(page, [/出发城市/, /出发地/, /from/i], h.FIXTURES.flightSearch.from);
  await h.fillField(page, [/到达城市/, /目的地/, /to/i], h.FIXTURES.flightSearch.to);
  await h.clickFirstAvailable(page, [[/双向箭头/, /swap/i, /exchange/i]]);
  await h.expectFieldValue(page, [/出发城市/, /出发地/, /from/i], [/广州/, /CAN/]);
  await h.expectFieldValue(page, [/到达城市/, /目的地/, /to/i], [/成都/, /CTU/]);
});
