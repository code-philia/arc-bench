import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-3.1.7
// fixtures: public_homepage, searchable_routes

test('REQ-3.1.7: Search without a valid arrival place', async ({ page }) => {
  await h.openHome(page);
  await h.fillField(page, 'From', h.FIXTURES.searchRoute.from);
  await h.fillField(page, 'Date', h.FIXTURES.searchRoute.date);
  await h.clickNamed(page, 'Search');
  await h.expectErrorFeedback(page, 'Please enter a valid arrival place.');
});
