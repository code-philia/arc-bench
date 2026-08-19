import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-7.2.2.1
// fixtures: flight_status_dataset

test('REQ-7.2.2.1: Route Range Query', async ({ page }) => {
  await h.openFlightStatusPage(page);
  await h.setRadio(page, [/起降地/, /route/i]);
  await h.fillField(page, [/出发城市/, /from/i], '上海');
  await h.fillField(page, [/到达城市/, /to/i], '北京');
  await h.clickFirstAvailable(page, [[/搜索/, /^search$/i]]);
  await h.expectAnyVisible(page, [[/航空公司/, /airline/i], [/航班号/, /flight number/i], [/状态/, /status/i]]);
});
