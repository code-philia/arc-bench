import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-4.8.1
// fixtures: products.detail

test('REQ-4.8.1: View Description Tab', async ({ page }) => {
  await h.openProductDetail(page, h.FIXTURES.products.detail);
  await page.getByRole('button', { name: /^Description$/i }).click();
  await expect(page.getByRole('main').getByText(/A soft, responsibly made cotton t-shirt/i).last()).toBeVisible();
});
