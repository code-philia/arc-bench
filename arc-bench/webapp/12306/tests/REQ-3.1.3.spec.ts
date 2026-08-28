import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-3.1.3
// fixtures: public_homepage, searchable_routes

test('REQ-3.1.3: Select a location from the tabbed selector', async ({ page }) => {
  await h.openHome(page);
  await h.clickNamed(page, 'From');
  await h.expectTextsVisible(page, ['Popular', 'ABCDE', 'FGHIJ', 'KLMNO', 'PQRST', 'UVWXYZ']);
  await h.clickNamed(page, 'ABCDE');
  await page.getByRole('button', { name: /Beijing/ }).first().click();
  await expect(page.getByLabel('From')).toHaveValue(/Beijing/);
});
