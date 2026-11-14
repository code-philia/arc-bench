// requirement: REQ-2.11
import { expect } from "@playwright/test";
import { test, button, region, flight, visible, textVisible, openHome, searchFlights } from "./helpers";

test('REQ-2.11: Expand and collapse the selected flight fare', async ({ page }) => {
  await openHome(page);
  await searchFlights(page);
  await button(flight(page, 'JD5162'), 'Show fares').click();
  await visible(region(flight(page, 'JD5162'), 'Fare options'));
  await visible(region(flight(page, 'JD5162'), 'Economy fare'));
  await textVisible(region(flight(page, 'JD5162'), 'Fare options'), 'Refund and change rules');
  await button(flight(page, 'JD5162'), 'Hide fares').click();
  await expect(region(flight(page, 'JD5162'), 'Fare options')).not.toBeVisible();
  await visible(button(flight(page, 'JD5162'), 'Show fares'));
});
