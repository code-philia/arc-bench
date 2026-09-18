import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-7.3
// fixtures: accounts.filterUser, homepage_questions, tags.catalog

test('REQ-7.3: Create Custom Filter', async ({ page }) => {
  await h.login(page, h.FIXTURES.accounts.filterUser);
  await h.openQuestionList(page);
  await page.getByRole('button', { name: /^Filter$/i }).click();
  const panel = page.getByRole('region', { name: /^Filter panel$/i });
  await panel.getByRole('checkbox', { name: /^No answers$/i }).check();
  await panel.getByRole('radio', { name: /^Newest$/i }).check();
  await panel.getByRole('textbox', { name: /^Tag$/i }).fill(h.FIXTURES.tags.filterTarget);
  await panel.getByRole('button', { name: /^Save custom filter$/i }).click();
  await panel.getByRole('textbox', { name: /^Filter title$/i }).fill(h.FIXTURES.filters.customName);
  await panel.getByRole('button', { name: /^Save filter$/i }).click();
  await expect(panel.getByText(`Filter saved: ${h.FIXTURES.filters.customName}`, { exact: true })).toBeVisible();
});
