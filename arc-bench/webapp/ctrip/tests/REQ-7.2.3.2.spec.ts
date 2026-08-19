import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-7.2.3.2
// fixtures: flight_status_history, flight_status_dataset

test('REQ-7.2.3.2: Clear History', async ({ page }) => {
  await h.openFlightStatusPage(page);
  await h.clickFirstAvailable(page, [[/清除历史/, /clear history/i]]);
  await h.expectAnyVisible(page, [[/无历史记录/, /history cleared/i, /暂无/]]);
});
