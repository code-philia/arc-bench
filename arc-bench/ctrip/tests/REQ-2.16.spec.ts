// requirement: REQ-2.16
import { expect } from "@playwright/test";
import { test, setChecked, checkbox, flight, visible, openHome, searchFlights, flightRows, selectChoice } from "./helpers";

test('REQ-2.16: Remove airline filter while keeping nonstop preference', async ({ page }) => {
  await openHome(page);
  await searchFlights(page);
  await setChecked(checkbox(page, 'Nonstop only'));
  await selectChoice(page, 'Airline', 'China Southern');
  await expect(flightRows(page)).toHaveCount(1);
  await selectChoice(page, 'Airline', 'All airlines');
  await expect(checkbox(page, 'Nonstop only')).toBeChecked();
  await expect(flightRows(page)).toHaveCount(2);
  await visible(flight(page, 'CZ3401'));
  await visible(flight(page, 'MU5234'));
  await expect(flight(page, 'JD5162')).toHaveCount(0);
});
