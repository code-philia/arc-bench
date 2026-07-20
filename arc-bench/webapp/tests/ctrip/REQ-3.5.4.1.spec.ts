import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-3.5.4.1
// fixtures: flight_search_home, flight_result_dataset

test('REQ-3.5.4.1: Expand/Collapse Flight Details', async ({ page }) => {
  await h.openFlightResults(page);
  await h.clickFirstAvailable(page, [[/展开/, /更多舱位/, /details/i]]);
  await h.expectAnyVisible(page, [[/退改签/, /refund/i, /change/i], [/经济舱/, /premium economy/i, /fare/i]]);
  await h.clickFirstAvailable(page, [[/收起/, /collapse/i]]);
  await h.expectVisible(page, [/展开/, /details/i]);
});
