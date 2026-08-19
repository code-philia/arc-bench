import { expect, test } from '@playwright/test';

test('REQ-1: Show and update the smoke counter', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { name: 'ARC Smoke Demo' })).toBeVisible();
  await expect(page.getByText('Ready for smoke testing')).toBeVisible();
  await expect(page.getByText('Count: 0')).toBeVisible();

  await page.getByRole('button', { name: 'Increment' }).click();

  await expect(page.getByText('Count: 1')).toBeVisible();
});
