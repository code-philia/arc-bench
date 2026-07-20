import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-9.3.1.1
// fixtures: airport_guide_catalog, airport_detail_dataset

test('REQ-9.3.1.1: View Airport Overview', async ({ page }) => {
  await h.openAirportDetail(page);
  await h.clickFirstAvailable(page, [[/机场简介/, /overview/i]]);
  await h.expectAnyVisible(page, [[/中国第一国门/, /overview/i, /跑道/, /runway/i]]);
});
