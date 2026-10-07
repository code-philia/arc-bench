// requirement: REQ-9.2
import { test, expect } from "@playwright/test";
import { button, region, visible, textVisible, openHome, installClock, openAirport } from "./helpers";

test.beforeEach(async ({ page }) => { await installClock(page); });

test('REQ-9.2: Read popular airport links', async ({ page }, testInfo) => {
  await openHome(page);
  await openAirport(page);
  for (const name of ['Beijing Capital Airport', 'Shanghai Pudong Airport', 'Guangzhou Baiyun Airport']) await visible(region(page, 'Popular airports').getByRole('link', { name, exact: true }));
});

test('REQ-9.2: Browse domestic cities by initial', async ({ page }, testInfo) => {
  await openHome(page);
  await openAirport(page);
  await button(region(page, 'Domestic airports'), 'C').click();
  for (const name of ['Chengdu', 'Chongqing', 'Changchun']) await visible(region(page, 'Domestic airports').getByRole('link', { name, exact: true }));
});

test('REQ-9.2: Read city weather snapshot', async ({ page }, testInfo) => {
  await openHome(page);
  await openAirport(page);
  await textVisible(region(page, 'Today weather'), 'Beijing');
  await textVisible(region(page, 'Today weather'), '-5°C to 3°C');
  await visible(region(page, 'Today weather').getByRole('link', { name: 'Boarding process', exact: true }));
});

