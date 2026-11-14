// requirement: REQ-2.10
import { expect } from "@playwright/test";
import { test, button, openHome, searchFlights, flightOrder, flightRows } from "./helpers";

test('REQ-2.10: Order by lowest price', async ({ page }) => {
  await openHome(page);
  await searchFlights(page);
  await button(page, 'Price: low to high').click();
  await expect(flightRows(page)).toHaveCount(3);
  await expect.poll(() => flightOrder(page)).toEqual(["CZ3401", "JD5162", "MU5234"]);
});

test('REQ-2.10: Order by highest punctuality', async ({ page }) => {
  await openHome(page);
  await searchFlights(page);
  await button(page, 'On-time: high to low').click();
  await expect(flightRows(page)).toHaveCount(3);
  await expect.poll(() => flightOrder(page)).toEqual(["CZ3401", "MU5234", "JD5162"]);
});

test('REQ-2.10: Order by earliest departure', async ({ page }) => {
  await openHome(page);
  await searchFlights(page);
  await button(page, 'Departure: earliest first').click();
  await expect(flightRows(page)).toHaveCount(3);
  await expect.poll(() => flightOrder(page)).toEqual(["MU5234", "JD5162", "CZ3401"]);
});
