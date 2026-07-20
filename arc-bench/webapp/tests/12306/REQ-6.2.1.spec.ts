import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-6.2.1
// fixtures: travel_guide_content

test('REQ-6.2.1: Open one guide category tab from the dropdown more link', async ({ page }) => {
  await h.openHome(page);
  await h.hoverNamed(page, /Travel guide/i);
  await h.clickNamed(page, /More/i);
  await h.expectTextsVisible(page, ['Ticketing', 'Endorsement and refund', 'Miscellaneous']);
});
