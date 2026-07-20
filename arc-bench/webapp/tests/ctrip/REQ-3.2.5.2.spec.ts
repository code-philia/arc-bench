import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-3.2.5.2
// fixtures: flight_search_home

test('REQ-3.2.5.2: Find Cities by Pinyin Group', async ({ page }) => {
  await h.openFlightSearch(page);
  await h.clickField(page, [/到达城市/, /to/i]);
  await h.expectAnyVisible(page, [[/GHIJ/]]);
  await h.clickFirstAvailable(page, [[/GHIJ/]]);
  await h.clickFirstAvailable(page, [[/广州/]]);
  await h.expectFieldValue(page, [/到达城市/, /to/i], [/广州/, /CAN/]);
});
