import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-3.2.1
// fixtures: category_listing

test('REQ-3.2.1: View Breadcrumb Navigation', async ({ page }) => {
  await h.openCategoryPage(page);
  const breadcrumbs = page.getByRole('navigation', { name: /^Breadcrumb$/i });
  await expect(breadcrumbs.getByRole('link', { name: /^Home$/i })).toBeVisible();
  await expect(breadcrumbs.getByRole('link', { name: /^Clothes$/i })).toBeVisible();
  await expect(breadcrumbs.getByText(/^Men$/i)).toBeVisible();
});
