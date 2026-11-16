// requirement: REQ-2.10
import { expect } from "@playwright/test";
import { test, sortFlights, openHome, searchFlights, flightOrder, flightRows } from "./helpers";

test('REQ-2.10: Order by lowest price', async ({ page }) => {
  await openHome(page);
  await searchFlights(page);
  await sortFlights(page, 'Price: low to high');
  await expect(flightRows(page)).toHaveCount(3);
  await expect.poll(() => flightOrder(page)).toEqual(["CZ3401", "JD5162", "MU5234"]);
});

test('REQ-2.10: Order by highest punctuality', async ({ page }) => {
  await openHome(page);
  await searchFlights(page);
  await sortFlights(page, 'On-time: high to low');
  await expect(flightRows(page)).toHaveCount(3);
  await expect.poll(() => flightOrder(page)).toEqual(["CZ3401", "MU5234", "JD5162"]);
});

test('REQ-2.10: Order by earliest departure', async ({ page }) => {
  await openHome(page);
  await searchFlights(page);
  await sortFlights(page, 'Departure: earliest first');
  await expect(flightRows(page)).toHaveCount(3);
  await expect.poll(() => flightOrder(page)).toEqual(["MU5234", "JD5162", "CZ3401"]);
});
