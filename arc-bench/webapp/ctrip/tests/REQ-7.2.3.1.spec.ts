import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-7.2.3.1
// fixtures: flight_status_history, flight_status_dataset

test('REQ-7.2.3.1: Use History', async ({ page }) => {
  await h.openFlightStatusPage(page);
  await h.clickFirstAvailable(page, [[/JD5162/], [/history/i]]);
  await h.expectAnyVisible(page, [[/JD5162/], [/值机柜台/, /check-in/i, /登机口/, /gate/i, /航空公司/, /airline/i]]);
});
