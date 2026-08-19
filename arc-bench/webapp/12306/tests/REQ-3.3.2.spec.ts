import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-3.3.2
// fixtures: transfer_only_route

test('REQ-3.3.2: Display detailed information for each transfer plan', async ({ page }) => {
  await h.openTransferResults(page);
  await h.clickNamed(page, /details|view/i);
  await h.expectTextsVisible(page, ['Transfer']);
});
