import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-3.2.5.1
// fixtures: flight_search_home

test('REQ-3.2.5.1: Select a Hot City', async ({ page }) => {
  await h.openFlightSearch(page);
  await h.clickField(page, [/出发城市/, /from/i]);
  await h.expectAnyVisible(page, [[/热门/, /hot/i]]);
  await h.clickFirstAvailable(page, [[/成都/]]);
  await h.expectFieldValue(page, [/出发城市/, /from/i], [/成都/, /CTU/]);
});
