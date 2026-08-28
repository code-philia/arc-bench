import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-6.2.2
// fixtures: travel_guide_content

test('REQ-6.2.2: Open one guide question from the navigation dropdown', async ({ page }) => {
  await h.openHome(page);
  await page.locator('.main-nav .nav-menu').filter({ hasText: /Travel guides/i }).hover();
  await h.clickNamed(page, /How to book tickets online\?/i);
  await expect(page.locator('.guide-tabs button', { hasText: 'Ticketing' })).toBeVisible();
  await expect(page.locator('[data-question="How to book tickets online?"]')).toBeInViewport();
});
