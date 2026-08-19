import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-9.1
// fixtures: airport_guide_catalog, airport_detail_dataset

test('REQ-9.1: Enter Airport Guide', async ({ page }) => {
  await h.openAirportGuide(page);
  await h.expectAnyVisible(page, [[/机场攻略/, /airport guide/i]]);
});
