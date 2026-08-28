import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-3.3.4
// fixtures: transfer_only_route

test('REQ-3.3.4: Toggle transfer plan sorting by total travel time', async ({ page }) => {
  await h.openTransferResults(page);
  await h.assertTransferSortToggle(page, 'Travel time');
});
