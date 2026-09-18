import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-6.1
// fixtures: tags.catalog

test('REQ-6.1: View All Tags', async ({ page }) => {
  await h.openTagsPage(page);
  await expect(page.getByRole('heading', { name: /^Tags$/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /^python$/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /^javascript$/i })).toBeVisible();
  const pythonCard = page.getByRole('article').filter({ has: page.getByRole('button', { name: /^python$/i }) });
  await expect(pythonCard.getByText(/questions/i)).toBeVisible();
});
