// requirement: REQ-2.11
import { test, expect } from "@playwright/test";
import { button, region, flight, visible, textVisible, openHome, installClock, searchFlights } from "./helpers";

test.beforeEach(async ({ page }) => { await installClock(page); });

test('REQ-2.11: Expand and collapse the selected flight fare', async ({ page }, testInfo) => {
  await openHome(page);
  await searchFlights(page);
  await button(flight(page, 'JD5162'), 'Show fares').click();
  await visible(region(flight(page, 'JD5162'), 'Fare options'));
  await visible(flight(page, 'JD5162').getByRole('group', { name: 'Economy fare', exact: true }));
  await textVisible(region(flight(page, 'JD5162'), 'Fare options'), 'Refund and change rules');
  await button(flight(page, 'JD5162'), 'Hide fares').click();
  await expect(region(flight(page, 'JD5162'), 'Fare options')).not.toBeVisible();
  await visible(button(flight(page, 'JD5162'), 'Show fares'));
});

