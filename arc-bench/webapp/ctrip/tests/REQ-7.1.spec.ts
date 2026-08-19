import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-7.1
// fixtures: flight_status_dataset

test('REQ-7.1: Enter Flight Status Page', async ({ page }) => {
  await h.openFlightStatusPage(page);
  await h.expectAnyVisible(page, [[/航班动态/, /flight status/i]]);
});
