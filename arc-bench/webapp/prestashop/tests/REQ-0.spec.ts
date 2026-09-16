import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-0
// fixtures: public_homepage

test('REQ-0: Visit Homepage', async ({ page }) => {
  await h.openHome(page);
  await expect(page.getByRole('region', { name: /^Carousel$/i })).toBeVisible();
  await expect(page.getByText(/^Popular products$/i)).toBeVisible();
  await expect(page.getByRole('textbox', { name: /^Search$/i })).toBeVisible();
});
