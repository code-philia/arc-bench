import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-2.1
// fixtures: public_homepage

test('REQ-2.1: Browse Homepage', async ({ page }) => {
  await h.openHome(page);
  await expect(page.getByRole('region', { name: /^Carousel$/i })).toBeVisible();
  await expect(page.getByRole('heading', { name: /^Popular products$/i })).toBeVisible();
  await expect(page.getByRole('textbox', { name: /^Newsletter email$/i })).toBeVisible();
  await expect(page.getByRole('contentinfo')).toBeVisible();
});
