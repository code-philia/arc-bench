import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-10.2.1
// fixtures: airport_guide_catalog, airport_detail_dataset

test('REQ-10.2.1: Enter International Airport Directory', async ({ page }) => {
  await h.openAirportGuide(page);
  await h.clickIfVisible(page, [/更多服务/, /more services/i]);
  await h.clickFirstAvailable(page, [[/国际机场大全/, /international airport/i]]);
  await h.expectAnyVisible(page, [[/国际/, /港澳台/, /international/i]]);
});
