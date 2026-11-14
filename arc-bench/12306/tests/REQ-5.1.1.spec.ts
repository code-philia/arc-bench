// requirement: REQ-5.1.1
import { expect } from '@playwright/test';
import { test } from './fixtures/test';
import { center, centerMenu, createAccount, entry, region } from './helpers';

test("REQ-5.1.1: Open authenticated personal center", async ({ page }) => {
  await entry(page);
  const account = await createAccount(page);
  await center(page);
  await expect(centerMenu(page)).toBeVisible();
  await expect(region(page, 'Notice')).toContainText(account.username);
});
