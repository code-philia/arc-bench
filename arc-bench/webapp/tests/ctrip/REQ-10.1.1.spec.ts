import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-10.1.1
// fixtures: airport_guide_catalog, airport_detail_dataset

test('REQ-10.1.1: Enter Domestic Airport Directory', async ({ page }) => {
  await h.openAirportGuide(page);
  await h.clickIfVisible(page, [/更多服务/, /more services/i]);
  await h.clickFirstAvailable(page, [[/国内机场大全/, /domestic airport/i]]);
  await h.expectAnyVisible(page, [[/国内机场/, /domestic airport/i]]);
});
