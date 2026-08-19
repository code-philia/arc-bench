import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-9.3.2.1
// fixtures: airport_guide_catalog, airport_detail_dataset

test('REQ-9.3.2.1: Check Shuttle Bus Timetable', async ({ page }) => {
  await h.openAirportDetail(page);
  await h.clickFirstAvailable(page, [[/机场交通/, /transportation/i]]);
  await h.expectAnyVisible(page, [[/市内巴士/, /shuttle/i, /line/i], [/首班/, /末班/, /first/i, /last/i]]);
});
