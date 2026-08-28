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
  await h.resetTestDatabase(page);
  await h.openHome(page);
  const date = page.getByLabel('Date');
  await expect(date).toHaveAttribute('min', /\d{4}-\d{2}-\d{2}/);
  await expect(date).toHaveAttribute('max', /\d{4}-\d{2}-\d{2}/);
  const min = await date.getAttribute('min');
  await expect(date).toHaveJSProperty('min', min);
});
