import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-6.2
// fixtures: tags.catalog, questions.taggedPython

test('REQ-6.2: Tag Detail Page', async ({ page }) => {
  await h.openTagDetail(page);
  await expect(page.getByRole('heading', { name: /^python$/i })).toBeVisible();
  await expect(page.getByText(/^Python is a dynamically typed, multi-purpose programming language/i)).toBeVisible();
  await expect(page.getByText(/questions/i).first()).toBeVisible();
});
