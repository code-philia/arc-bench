import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-6.2.1
// fixtures: travel_guide_content

test('REQ-6.2.1: Open one guide category tab from the dropdown more link', async ({ page }) => {
  await h.openHome(page);
  await page.locator('.main-nav .nav-menu').filter({ hasText: /Travel guides/i }).hover();
  await h.clickNamed(page, /More/i);
  await expect(page.locator('.guide-tabs button', { hasText: 'Ticketing' })).toBeVisible();
  await expect(page.locator('.guide-tabs button', { hasText: 'Endorsement and refund' })).toBeVisible();
  await expect(page.locator('.guide-tabs button', { hasText: 'Miscellaneous' })).toBeVisible();
  await expect(page.locator('.guide-tabs button.active')).toHaveText('Ticketing');
});
