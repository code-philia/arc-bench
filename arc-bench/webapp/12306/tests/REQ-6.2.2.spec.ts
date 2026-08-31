import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-6.2.2
// fixtures: travel_guide_content

test('REQ-6.2.2: Open one guide question from the navigation dropdown', async ({ page }) => {
  await h.openHome(page);
  await h.hoverNamed(page, /Travel guides/i);
  await h.clickNamed(page, /How to book tickets online\?/i);
  await h.expectTextsVisible(page, ['Ticketing']);
  await expect(page.getByRole('heading', { name: /How to book tickets online\?/i })).toBeInViewport();
});
