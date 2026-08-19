import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-3.2.1
// fixtures: flight_search_home

test('REQ-3.2.1: Trip Type Selection', async ({ page }) => {
  await h.openFlightSearch(page);
  await h.clickFirstAvailable(page, [[/往返/, /round trip/i]]);
  await h.expectAnyVisible(page, [[/返回日期/, /return date/i]]);
  await h.clickFirstAvailable(page, [[/单程/, /one way/i]]);
  await h.expectAnyVisible(page, [[/\+\s*添加返程/, /添加返程/, /add return/i]]);
});
