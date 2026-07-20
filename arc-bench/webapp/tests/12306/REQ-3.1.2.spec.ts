import { test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-3.1.2
// fixtures: public_homepage, searchable_routes

test('REQ-3.1.2: Select a location from the fuzzy-matched list', async ({ page }) => {
  await h.openHome(page);
  await h.fillField(page, 'From', h.FIXTURES.searchRoute.fuzzyInput);
  await h.expectTextsVisible(page, ['Top destinations']);
});
