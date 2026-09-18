import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-3.3.1
// fixtures: questions.detail

test('REQ-3.3.1: Default Question View', async ({ page }) => {
  await h.openQuestionDetail(page, h.FIXTURES.questions.detail);
  await expect(page.getByRole('banner')).toBeVisible();
  await expect(page.getByRole('main')).toBeVisible();
  await expect(page.getByRole('complementary')).toHaveCount(2);
  await expect(page.getByRole('heading', { name: h.FIXTURES.questions.detail.title, exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: /Answers$/i })).toBeVisible();
});
