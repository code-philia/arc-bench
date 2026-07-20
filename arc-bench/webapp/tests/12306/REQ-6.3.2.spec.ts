import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-6.3.2
// fixtures: travel_guide_content

test('REQ-6.3.2: Open the travel guide page from the quick guide more link', async ({ page }) => {
  await h.openHome(page);
  await h.clickNamed(page, /^More$/i);
  await h.expectTextsVisible(page, ['Ticketing']);
});
