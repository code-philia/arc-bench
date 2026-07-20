import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-3.3.5
// fixtures: transfer_only_route

test('REQ-3.3.5: Toggle transfer plan sorting by second-segment arrival time', async ({ page }) => {
  await h.openTransferResults(page);
  await h.assertSortToggle(page, 'Arrival Time');
});
