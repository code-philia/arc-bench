import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-3.3.3
// fixtures: transfer_only_route

test('REQ-3.3.3: Toggle transfer plan sorting by first-segment departure time', async ({ page }) => {
  await h.openTransferResults(page);
  await h.assertTransferSortToggle(page, 'Departure Time');
});
