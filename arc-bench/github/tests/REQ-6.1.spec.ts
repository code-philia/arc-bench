import { openVisibleTarget } from "./support/e2e";
import { baseUrl } from './support/e2e';
import { expect, test } from '@playwright/test';
import { seedValue, signIn, seedAccount } from './support/e2e';

test.beforeEach(async ({ page }) => {
  await page.goto(baseUrl());
});

test('REQ-6.1: Protect Branches with Review and Status-Check Requirements - Scenario 1', async ({ page }, testInfo) => {
  const administrator = seedAccount(testInfo, 'PROTECTION_ADMIN');
  const repositoryEntry = seedValue(testInfo, 'PROTECTION_REPOSITORY_ENTRY');
  const pattern = seedValue(testInfo, 'PROTECTED_BRANCH_PATTERN');

  await signIn(page, administrator);
  await openVisibleTarget(page, repositoryEntry);
  await page.getByRole('link', { name: /settings/i }).click();
  await page.getByRole('link', { name: /branches/i }).click();
  await page.getByRole('button', { name: /add branch protection rule/i }).click();
  await page.getByLabel(/branch name pattern/i).fill(pattern);
  await page.getByRole('checkbox', { name: /require.*1.*approval|require.*review/i }).check();
  await page.getByRole('checkbox', { name: /require.*status check.*test/i }).check();
  await page.getByRole('button', { name: /create|save changes/i }).click();
  await page.reload();
  await expect(page.getByText(pattern, { exact: true })).toBeVisible();
  await expect(page.getByText(/1 approval/i)).toBeVisible();
  await expect(page.getByText(/status check.*test/i)).toBeVisible();
});

test('REQ-6.1: Protect Branches with Review and Status-Check Requirements - Scenario 2', async ({ page }, testInfo) => {
  const nonAdministrator = seedAccount(testInfo, 'PROTECTION_NON_ADMIN');
  const repositoryEntry = seedValue(testInfo, 'PROTECTION_REPOSITORY_ENTRY');

  await signIn(page, nonAdministrator);
  await openVisibleTarget(page, repositoryEntry);

  const settingsLink = page.getByRole('link', { name: /settings/i });
  if ((await settingsLink.count()) > 0) {
    await settingsLink.click();
    const branchesLink = page.getByRole('link', { name: /branches/i });
    if ((await branchesLink.count()) > 0) {
      await branchesLink.click();
    }
  }

  await expect(
    page.getByRole('button', { name: /add branch protection rule/i }),
  ).toHaveCount(0);
});

test('REQ-6.1: Protect Branches with Review and Status-Check Requirements - Scenario 3', async ({ page }, testInfo) => {
  const administrator = seedAccount(testInfo, 'PROTECTION_ADMIN');
  const pullRequestEntry = seedValue(testInfo, 'PROTECTION_PULL_REQUEST_ENTRY');

  await signIn(page, administrator);
  await openVisibleTarget(page, pullRequestEntry);
  await expect(page.getByText(/test.*pending|pending.*test/i)).toBeVisible();
  const testStatus = page.getByRole('combobox', { name: /test.*status|status.*test/i });
  await testStatus.click();
  await page.getByRole('option', { name: /success/i }).click();
  await page.getByRole('button', { name: /save|update/i }).click();

  await expect(page.getByText(/test.*success|success.*test/i)).toBeVisible();
  await expect(page.getByText(administrator.username, { exact: true }).first()).toBeVisible();
  await page.reload();
  await expect(page.getByText(/test.*success|success.*test/i)).toBeVisible();
});
