import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-8.2.2
// fixtures: badge_catalog

test('REQ-8.2.2: View All Badges', async ({ page }) => {
  await h.openHome(page);
  await h.clickFirstAvailable(page, [[/^badges$/i]]);
  await h.expectTextsVisible(page, [/gold/i, /silver/i, /bronze/i, /great answer|teacher/i]);
});
