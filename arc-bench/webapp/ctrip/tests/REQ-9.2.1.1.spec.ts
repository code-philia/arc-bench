import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-9.2.1.1
// fixtures: airport_guide_catalog, airport_detail_dataset

test('REQ-9.2.1.1: Browse Popular Airports', async ({ page }) => {
  await h.openAirportGuide(page);
  await h.expectAnyVisible(page, [[/北京首都/], [/上海浦东/], [/广州白云/]]);
});
