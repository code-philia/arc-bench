import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-9.2.2.1
// fixtures: airport_guide_catalog, airport_detail_dataset

test('REQ-9.2.2.1: View Travel Weather', async ({ page }) => {
  await h.openAirportGuide(page);
  await h.expectAnyVisible(page, [[/今日天气/, /weather/i], [/乘机流程/, /travel process/i]]);
});
