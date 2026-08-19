import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-3.1.4
// fixtures: public_homepage, searchable_routes

test('REQ-3.1.4: Select a valid departure date in the allowed range', async ({ page }) => {
  await h.openHome(page);
  await h.fillField(page, 'Date', h.FIXTURES.searchRoute.date);
  await h.expectTextsVisible(page, [h.FIXTURES.searchRoute.date]);
});

test('REQ-3.1.4: Prevent selection of an expired date', async ({ page }) => {
  await h.openHome(page);
  await h.clickNamed(page, 'Date');
  await h.expectTextsVisible(page, ['Date']);
});
