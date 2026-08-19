import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-3.3.1
// fixtures: transfer_only_route

test('REQ-3.3.1: Display transfer plans after a no-direct-train search', async ({ page }) => {
  await h.openTransferResults(page);
  await h.expectTextsVisible(page, ['Transfer']);
});
