import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-9.3.3.1
// fixtures: airport_guide_catalog, airport_detail_dataset

test('REQ-9.3.3.1: Find First Aid Phone Number', async ({ page }) => {
  await h.openAirportDetail(page);
  await h.clickFirstAvailable(page, [[/机场电话/, /phone/i]]);
  await h.expectAnyVisible(page, [[/急救/, /first aid/i], [/010-/, /phone/i]]);
});
