import { openVisibleTarget } from "./support/e2e";
import { baseUrl } from './support/e2e';
import { expect, test } from '@playwright/test';
import { seedValue, signIn, seedAccount } from './support/e2e';

test.beforeEach(async ({ page }) => {
  await page.goto(baseUrl());
});

test('REQ-6.5: Merge an Eligible Pull Request - Scenario 1', async ({ page }, testInfo) => {
  const maintainer = seedAccount(testInfo, 'PR_MAINTAINER');
  const pullRequestEntry = seedValue(testInfo, 'MERGEABLE_PULL_REQUEST_ENTRY');

  await signIn(page, maintainer);
  await openVisibleTarget(page, pullRequestEntry);
  await page.getByRole('button', { name: /merge pull request/i }).click();
  await page.getByRole('button', { name: /confirm merge/i }).click();
  await expect(page.getByText(/merged/i)).toBeVisible();
  await page.reload();
  await expect(page.getByText(/merged/i)).toBeVisible();
});

test('REQ-6.5: Merge an Eligible Pull Request - Scenario 2', async ({ page }, testInfo) => {
  const maintainer = seedAccount(testInfo, 'PR_MAINTAINER');
  const pullRequestEntry = seedValue(testInfo, 'UNMERGEABLE_PULL_REQUEST_ENTRY');
  await signIn(page, maintainer);
  await openVisibleTarget(page, pullRequestEntry);
  const merge = page.getByRole('button', { name: /merge pull request/i });
  await expect(merge).toBeDisabled();
  await expect(page.getByText(/review|required|protection/i)).toBeVisible();
});
