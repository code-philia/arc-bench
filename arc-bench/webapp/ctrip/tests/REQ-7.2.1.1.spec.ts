import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-7.2.1.1
// fixtures: flight_status_dataset

test('REQ-7.2.1.1: Exact Flight Number Query', async ({ page }) => {
  await h.openFlightStatusPage(page);
  await h.setRadio(page, [/航班号/, /flight number/i]);
  await h.expectAnyVisible(page, [[/航班号/, /flight number/i], [/日期/, /date/i]]);
  await h.fillField(page, [/航班号/, /flight number/i], h.FIXTURES.flightSearch.flightNumber);
  await h.clickFirstAvailable(page, [[/搜索/, /^search$/i]]);
  await h.expectAnyVisible(page, [[/JD5162/], [/值机柜台/, /check-in/i, /登机口/, /gate/i]]);
});
