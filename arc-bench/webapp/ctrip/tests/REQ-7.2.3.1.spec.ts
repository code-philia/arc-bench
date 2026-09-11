import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-7.2.3.1
// fixtures: flight_status_history_use, flight_status_dataset

test('REQ-7.2.3.1: Use History', async ({ page }) => {
  await h.openFlightStatusPage(page, h.FIXTURES.flightStatus.historyUse);
  await h.clickFirstAvailable(page, [[h.FIXTURES.flightStatus.historyUse.entry]]);
  await h.expectAnyVisible(page, [[h.FIXTURES.flightStatus.historyUse.entry], [/值机柜台/, /check-in/i, /登机口/, /gate/i, /航空公司/, /airline/i]]);
});
