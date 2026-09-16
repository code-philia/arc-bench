import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-1.2
// fixtures: public_homepage

test('REQ-1.2: Logo Click Returns Home', async ({ page }) => {
  await h.openCategoryPage(page);
  await page.getByRole('link', { name: /^Logo$/i }).click();
  await expect(page.getByRole('region', { name: /^Carousel$/i })).toBeVisible();
});
