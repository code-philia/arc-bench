// requirement: REQ-2.10
import { test, expect } from "@playwright/test";
import { button, region, openHome, installClock, searchFlights, flightOrder } from "./helpers";

test.beforeEach(async ({ page }) => { await installClock(page); });

test('REQ-2.10: Order by lowest price', async ({ page }, testInfo) => {
  await openHome(page);
  await searchFlights(page);
  await button(page, 'Price: low to high').click();
  await expect(region(page, 'Flight list').getByRole('listitem')).toHaveCount(3);
  await expect.poll(() => flightOrder(page)).toEqual(["CZ3401", "JD5162", "MU5234"]);
});

test('REQ-2.10: Order by highest punctuality', async ({ page }, testInfo) => {
  await openHome(page);
  await searchFlights(page);
  await button(page, 'On-time: high to low').click();
  await expect(region(page, 'Flight list').getByRole('listitem')).toHaveCount(3);
  await expect.poll(() => flightOrder(page)).toEqual(["CZ3401", "MU5234", "JD5162"]);
});

test('REQ-2.10: Order by earliest departure', async ({ page }, testInfo) => {
  await openHome(page);
  await searchFlights(page);
  await button(page, 'Departure: earliest first').click();
  await expect(region(page, 'Flight list').getByRole('listitem')).toHaveCount(3);
  await expect.poll(() => flightOrder(page)).toEqual(["MU5234", "JD5162", "CZ3401"]);
});

