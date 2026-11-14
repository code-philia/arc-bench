// requirement: REQ-9.4
import { expect } from "@playwright/test";
import { test, action, region, visible, heading, openHome, selectedTab } from "./helpers";

test('REQ-9.4: Open domestic airport directory', async ({ page }) => {
  await openHome(page);
  await action(page, 'Flights').click();
  await action(page, 'More services').click();
  await action(page, 'Domestic airport directory').click();
  await heading(page, 'Airport guide');
  await expect(selectedTab(page, 'Domestic airports')).toBeVisible();
  await visible(action(region(page, 'Domestic airports'), 'Chengdu'));
});

test('REQ-9.4: Open international airport directory', async ({ page }) => {
  await openHome(page);
  await action(page, 'Flights').click();
  await action(page, 'More services').click();
  await action(page, 'International airport directory').click();
  await heading(page, 'Airport guide');
  await expect(selectedTab(page, 'International and Hong Kong, Macau, Taiwan airports')).toBeVisible();
  await visible(action(region(page, 'International and Hong Kong, Macau, Taiwan airports'), 'Hong Kong International Airport'));
});
