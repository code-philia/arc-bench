// requirement: REQ-9.4
import { expect } from "@playwright/test";
import { test, action, region, visible, expectAirportGuideHeading, expectDomesticAirportCity, openHome, selectedTab } from "./helpers";

test('REQ-9.4: Open domestic airport directory', async ({ page }) => {
  await openHome(page);
  await action(page, 'Flights').click();
  await action(page, 'More services').click();
  await action(page, /^Domestic airport directory(?:\s+.+)?$/).click();
  await expectAirportGuideHeading(page);
  await expect(selectedTab(page, 'Domestic airports')).toBeVisible();
  await expectDomesticAirportCity(page, 'Chengdu');
});

test('REQ-9.4: Open international airport directory', async ({ page }) => {
  await openHome(page);
  await action(page, 'Flights').click();
  await action(page, 'More services').click();
  await action(page, /^International airport directory(?:\s+.+)?$/).click();
  await expectAirportGuideHeading(page);
  await expect(selectedTab(page, 'International and Hong Kong, Macau, Taiwan airports')).toBeVisible();
  await visible(action(region(page, 'International and Hong Kong, Macau, Taiwan airports'), /^(?:中国香港\s+)?Hong Kong International Airport$|^(?:中国)?香港(?:国际|赤鱲角)机场$/i));
});
