import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-3.1.4
// fixtures: public_homepage, searchable_routes

test('REQ-3.1.4: Select a valid departure date in the allowed range', async ({ page }) => {
  await h.openHome(page);
  const date = page.getByLabel('Date');
  await date.fill(h.FIXTURES.searchRoute.date);
  await expect(date).toHaveValue(h.FIXTURES.searchRoute.date);
});

test('REQ-3.1.4: Prevent selection of an expired date', async ({ page }) => {
  await h.openHome(page);
  await h.fillField(page, 'From', h.FIXTURES.searchRoute.from);
  await h.fillField(page, 'To', h.FIXTURES.searchRoute.to);
  await h.fillField(page, 'Date', h.dateOffset(-1));
  await h.clickNamed(page, 'Search');
  await h.expectErrorFeedback(page, 'Please choose a departure date from today through the next two weeks.');
  await expect(page).not.toHaveURL(/\/search(?:\?|$)/);
});
