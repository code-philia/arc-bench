// requirement: REQ-9.4
import { test, expect } from "@playwright/test";
import { action, region, tab, visible, heading, openHome, installClock } from "./helpers";

test.beforeEach(async ({ page }) => { await installClock(page); });

test('REQ-9.4: Open domestic airport directory', async ({ page }, testInfo) => {
  await openHome(page);
  await action(page, 'Flights').click();
  await action(page, 'More services').click();
  await action(page, 'Domestic airport directory').click();
  await heading(page, 'Airport guide');
  await expect(tab(page, 'Domestic airports')).toHaveAttribute('aria-selected', 'true');
  await visible(region(page, 'Domestic airports').getByRole('link', { name: 'Chengdu', exact: true }));
});

test('REQ-9.4: Open international airport directory', async ({ page }, testInfo) => {
  await openHome(page);
  await action(page, 'Flights').click();
  await action(page, 'More services').click();
  await action(page, 'International airport directory').click();
  await heading(page, 'Airport guide');
  await expect(tab(page, 'International and Hong Kong, Macau, Taiwan airports')).toHaveAttribute('aria-selected', 'true');
  await visible(region(page, 'International and Hong Kong, Macau, Taiwan airports').getByRole('link', { name: 'Hong Kong International Airport', exact: true }));
});

