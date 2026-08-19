import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-3.2.3
// fixtures: searchable_routes, search_results_dataset

test('REQ-3.2.3: Show the empty result state when no train matches', async ({ page }) => {
  await h.openHome(page);
  await h.fillField(page, 'From', h.FIXTURES.emptyRoute.from);
  await h.fillField(page, 'To', h.FIXTURES.emptyRoute.to);
  await h.fillField(page, 'Date', h.FIXTURES.emptyRoute.date);
  await h.clickNamed(page, 'Search');
  await h.expectTextsVisible(page, ['0 results']);
});
