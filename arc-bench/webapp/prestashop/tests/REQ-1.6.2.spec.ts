import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-1.6.2
// fixtures: public_homepage

test('REQ-1.6.2: Click to Enter Cart', async ({ page }) => {
  await h.openHome(page);
  await h.openCart(page);
  await expect(page.getByRole('heading', { name: /^Shopping cart$/i })).toBeVisible();
});
