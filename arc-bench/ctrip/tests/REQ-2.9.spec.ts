// requirement: REQ-2.9
import { expect } from "@playwright/test";
import { test, setChecked, checkbox, flight, visible, openHome, searchFlights, flightRows, selectChoice } from "./helpers";

test('REQ-2.9: Compose nonstop and airline filters', async ({ page }) => {
  await openHome(page);
  await searchFlights(page);
  await expect(flightRows(page)).toHaveCount(3);
  await setChecked(checkbox(page, 'Nonstop only'));
  await expect(flightRows(page)).toHaveCount(2);
  await visible(flight(page, 'CZ3401'));
  await visible(flight(page, 'MU5234'));
  await expect(flight(page, 'JD5162')).toHaveCount(0);
  await selectChoice(page, 'Airline', 'China Southern');
  await expect(flightRows(page)).toHaveCount(1);
  await visible(flight(page, 'CZ3401'));
});
