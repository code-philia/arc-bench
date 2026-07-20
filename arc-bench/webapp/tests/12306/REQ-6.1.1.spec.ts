import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-6.1.1
// fixtures: travel_guide_content

test('REQ-6.1.1: Open the travel guide page from the navigation bar', async ({ page }) => {
  await h.openTravelGuide(page);
  await h.expectTextsVisible(page, ['Ticketing', 'Endorsement and refund', 'Miscellaneous']);
});
