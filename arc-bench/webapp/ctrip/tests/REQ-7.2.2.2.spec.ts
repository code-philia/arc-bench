import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-7.2.2.2
// fixtures: flight_status_dataset

test('REQ-7.2.2.2: Swap Origin and Destination', async ({ page }) => {
  await h.openFlightStatusPage(page);
  await h.setRadio(page, [/起降地/, /route/i]);
  await h.fillField(page, [/出发城市/, /from/i], '上海');
  await h.fillField(page, [/到达城市/, /to/i], '北京');
  await h.clickFirstAvailable(page, [[/双向箭头/, /swap/i]]);
  await h.expectFieldValue(page, [/出发城市/, /from/i], '北京');
  await h.expectFieldValue(page, [/到达城市/, /to/i], '上海');
});
