import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-3.1.6
// fixtures: public_homepage, searchable_routes

test('REQ-3.1.6: Search without a valid departure place', async ({ page }) => {
  await h.openHome(page);
  await h.fillField(page, 'To', h.FIXTURES.searchRoute.to);
  await h.fillField(page, 'Date', h.FIXTURES.searchRoute.date);
  await h.clickNamed(page, 'Search');
  await h.expectErrorFeedback(page, 'Please enter a valid departure place.');
});
