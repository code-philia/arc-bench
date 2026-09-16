import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-1.4
// fixtures: public_homepage, searchable_catalog

test('REQ-1.4: Search Function', async ({ page }) => {
  await h.openHome(page);
  const search = page.getByRole('textbox', { name: /^Search$/i });
  await search.fill('skirt');
  await expect(page.getByRole('button', { name: /^Printed summer skirt €35\.00$/i })).toBeVisible();
  await search.press('Enter');
  await expect(page.getByRole('heading', { name: /^Search results for “skirt”$/i })).toBeVisible();
  await expect(page.getByRole('link', { name: /^Printed summer skirt$/i })).toBeVisible();
});
