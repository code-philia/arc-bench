import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-2.2.3
// fixtures: public_homepage

test('REQ-2.2.3: Click Carousel to Navigate', async ({ page }) => {
  await h.openHome(page);
  await page.getByRole('link', { name: /^Shop new arrivals$/i }).first().click();
  await expect(page.getByRole('heading', { name: /^Men$/i })).toBeVisible();
});
