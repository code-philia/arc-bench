import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-3.4.1
// fixtures: flight_search_home

test('REQ-3.4.1: Run a Standard Search', async ({ page }) => {
  await h.openFlightResults(page);
  await h.expectFlightResults(page);
});
