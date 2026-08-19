import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-9.2.1.2
// fixtures: airport_guide_catalog, airport_detail_dataset

test('REQ-9.2.1.2: Find via Alphabet Index', async ({ page }) => {
  await h.openAirportGuide(page);
  await h.clickFirstAvailable(page, [[/C/]]);
  await h.expectAnyVisible(page, [[/成都/], [/重庆/], [/长春/]]);
});
