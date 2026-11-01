import { openVisibleTarget } from "./support/e2e";
import { baseUrl } from './support/e2e';
import { expect, test } from '@playwright/test';
import { seedValue, signIn, seedAccount } from './support/e2e';

test.beforeEach(async ({ page }) => {
  await page.goto(baseUrl());
});

test('REQ-5.3.1: Assign or Unassign Issue Participants - Scenario 1', async ({ page }, testInfo) => {
  const editor = seedAccount(testInfo, 'ISSUE_EDITOR');
  const issueEntry = seedValue(testInfo, 'ASSIGNABLE_ISSUE_ENTRY');

  await signIn(page, editor);
  await openVisibleTarget(page, issueEntry);
  await expect(page.getByRole('button', { name: /assignees/i })).toBeVisible();
});
