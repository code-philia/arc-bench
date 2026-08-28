import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-3.3.2
// fixtures: transfer_only_route

test('REQ-3.3.2: Display detailed information for each transfer plan', async ({ page }) => {
  await h.openTransferResults(page);
  await expect(page.locator('.transfer-plan')).toHaveCount(2);
  await h.expectTextsVisible(page, ['Yancheng', 'Lhasa', 'Transfer waiting', 'Book']);
  await expect(page.locator('.transfer-plan').first()).toContainText(/D2136|G1818/);
});
