import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-3.3.1
// fixtures: flight_search_home

test('REQ-3.3.1: Configure Special Passengers', async ({ page }) => {
  await h.openFlightSearch(page);
  await h.setCheckbox(page, [/带儿童/, /child/i], true);
  await h.clickFirstAvailable(page, [[/搜索/, /^search$/i]]);
  await h.expectAnyVisible(page, [[/儿童/, /child/i, /婴儿/, /infant/i, /特殊旅客/, /special passenger/i]]);
});
