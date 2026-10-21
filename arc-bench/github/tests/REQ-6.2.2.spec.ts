import { openVisibleTarget } from "./support/e2e";
import { baseUrl } from './support/e2e';
import { expect, test } from '@playwright/test';
import { seedValue, signIn, seedAccount } from './support/e2e';

test.beforeEach(async ({ page }) => {
  await page.goto(baseUrl());
});

test('REQ-6.2.2: Compare Branches Before Opening a Pull Request - Scenario 1', async ({ page }, testInfo) => {
  const contributor = seedAccount(testInfo, 'PR_CONTRIBUTOR');
  const pullsEntry = seedValue(testInfo, 'PULL_REQUESTS_ENTRY');
  const base = seedValue(testInfo, 'PR_BASE_BRANCH');
  const compare = seedValue(testInfo, 'PR_COMPARE_BRANCH');
  const changedFile = seedValue(testInfo, 'PR_CHANGED_FILE');

  await signIn(page, contributor);
  await openVisibleTarget(page, pullsEntry);
  await page.getByRole('link', { name: /new pull request/i }).click();
  await page.getByRole('combobox', { name: /base/i }).selectOption({ label: base });
  await page.getByRole('combobox', { name: /compare/i }).selectOption({ label: compare });
  await page.getByRole('button', { name: /compare changes/i }).click();
  await expect(page.getByText(changedFile, { exact: true })).toBeVisible();
  await expect(page.getByText(/commit/i)).toBeVisible();
});

test('REQ-6.2.2: Compare Branches Before Opening a Pull Request - Scenario 2', async ({ page }, testInfo) => {
  const contributor = seedAccount(testInfo, 'PR_CONTRIBUTOR');
  const pullsEntry = seedValue(testInfo, 'PULL_REQUESTS_ENTRY');
  const branch = seedValue(testInfo, 'PR_BASE_BRANCH');

  await signIn(page, contributor);
  await openVisibleTarget(page, pullsEntry);
  await page.getByRole('link', { name: /new pull request/i }).click();
  await page.getByRole('combobox', { name: /base/i }).selectOption({ label: branch });
  await page.getByRole('combobox', { name: /compare/i }).selectOption({ label: branch });

  await expect(page.getByText(/identical/i)).toBeVisible();
  const createButton = page.getByRole('button', {
    name: /create pull request/i,
  });
  if ((await createButton.count()) > 0) {
    await expect(createButton).toBeDisabled();
  }
});
