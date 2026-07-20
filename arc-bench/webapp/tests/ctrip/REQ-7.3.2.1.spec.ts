import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-7.3.2.1
// fixtures: flight_status_dataset

test('REQ-7.3.2.1: View Detailed Status', async ({ page }) => {
  await h.openFlightStatusPage(page);
  await h.setRadio(page, [/航班号/, /flight number/i]);
  await h.fillField(page, [/航班号/, /flight number/i], h.FIXTURES.flightSearch.flightNumber);
  await h.clickFirstAvailable(page, [[/搜索/, /^search$/i]]);
  await h.expectAnyVisible(page, [[/出发/, /到达/, /progress/i], [/值机柜台/, /check-in/i], [/登机口/, /gate/i], [/行李转盘/, /baggage/i]]);
});
