import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-3.3.2
// fixtures: transfer_only_route

test('REQ-3.3.2: Display detailed information for each transfer plan', async ({ page }) => {
  await h.openTransferResults(page);
  await h.expectTextsVisible(page, ['Yancheng', 'Lhasa', 'Transfer waiting', 'Book']);
  const plans = page.getByRole('article');
  expect(await plans.count()).toBeGreaterThan(0);
  for (let index = 0; index < await plans.count(); index += 1) {
    await expect(plans.nth(index)).toContainText(/Transfer waiting/i);
    await expect(plans.nth(index)).toContainText(/Total travel time:\s*\d+\s*minutes/i);
    await expect(plans.nth(index).getByRole('button', { name: /^Book$/i })).toBeVisible();
  }
});
