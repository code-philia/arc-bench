import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-1.1
// fixtures: public_homepage, homepage_questions

test('REQ-1.1: View Homepage Layout', async ({ page }) => {
  await h.openHome(page);
  await expect(page.getByRole('banner')).toBeVisible();
  await expect(page.getByRole('main')).toBeVisible();
  await expect(page.getByRole('complementary')).toHaveCount(2);
  await expect(page.getByRole('heading', { name: /^Newest Questions$/i })).toBeVisible();
  await expect(page.getByRole('article').first()).toBeVisible();
});
