import { openVisibleTarget } from "./support/e2e";
import { baseUrl } from './support/e2e';
import { expect, test } from '@playwright/test';
import { seedValue, signIn, uniqueAccount, seedAccount } from './support/e2e';

test.beforeEach(async ({ page }) => {
  await page.goto(baseUrl());
});

test('REQ-5.2.3: Comment on an Issue Discussion - Scenario 1', async ({ page }, testInfo) => {
  const commenter = seedAccount(testInfo, 'ISSUE_COMMENTER');
  const issueEntry = seedValue(testInfo, 'COMMENTABLE_ISSUE_ENTRY');
  const comment = `Playwright comment ${uniqueAccount().username.slice(-10)}`;

  await signIn(page, commenter);
  await openVisibleTarget(page, issueEntry);
  await page.getByLabel(/comment/i).fill(comment);
  await page.getByRole('button', { name: /^comment$/i }).click();
  await expect(page.getByText(comment, { exact: true })).toBeVisible();
  await expect(page.getByText(commenter.username, { exact: true }).first()).toBeVisible();
  await page.reload();
  await expect(page.getByText(comment, { exact: true })).toBeVisible();
});

test('REQ-5.2.3: Comment on an Issue Discussion - Scenario 2', async ({ page }, testInfo) => {
  const commenter = seedAccount(testInfo, 'ISSUE_COMMENTER');
  const issueEntry = seedValue(testInfo, 'COMMENT_VALIDATION_ISSUE_ENTRY');

  await signIn(page, commenter);
  await openVisibleTarget(page, issueEntry);
  const timelineItems = page.getByRole('article');
  const beforeCount = await timelineItems.count();
  const commentButton = page.getByRole('button', { name: /^comment$/i });

  await page.getByLabel(/comment/i).fill('   ');
  if (await commentButton.isEnabled()) {
    await commentButton.click();
    await expect(page.getByText(/comment.*required|comment.*empty/i)).toBeVisible();
  } else {
    await expect(commentButton).toBeDisabled();
  }

  await page.reload();
  await expect(page.getByRole('article')).toHaveCount(beforeCount);
});
