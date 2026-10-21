import { openVisibleTarget } from "./support/e2e";
import { baseUrl } from './support/e2e';
import { expect, test } from '@playwright/test';
import { seedValue, signIn, seedAccount } from './support/e2e';

test.beforeEach(async ({ page }) => {
  await page.goto(baseUrl());
});

test('REQ-5.3.3: Assign Issues and Pull Requests to a Milestone - Scenario 1', async ({ page }, testInfo) => {
  const collaborator = seedAccount(testInfo, 'ISSUE_EDITOR');
  const issueEntry = seedValue(testInfo, 'MILESTONE_ISSUE_ENTRY');
  const milestone = seedValue(testInfo, 'ISSUE_MILESTONE');

  await signIn(page, collaborator);
  await openVisibleTarget(page, issueEntry);
  await page.getByRole('button', { name: /milestone/i }).click();
  await page.getByRole('option', { name: milestone, exact: true }).click();
  await expect(page.getByText(milestone, { exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByText(milestone, { exact: true })).toBeVisible();
});
