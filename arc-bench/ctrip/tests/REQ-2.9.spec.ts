// requirement: REQ-2.9
import { test, expect } from "@playwright/test";
import { field, region, checkbox, flight, visible, openHome, installClock, searchFlights } from "./helpers";

test.beforeEach(async ({ page }) => { await installClock(page); });

test('REQ-2.9: Compose nonstop and airline filters', async ({ page }, testInfo) => {
  await openHome(page);
  await searchFlights(page);
  await expect(region(page, 'Flight list').getByRole('listitem')).toHaveCount(3);
  await checkbox(page, 'Nonstop only').check();
  await expect(region(page, 'Flight list').getByRole('listitem')).toHaveCount(2);
  await visible(flight(page, 'CZ3401'));
  await visible(flight(page, 'MU5234'));
  await expect(flight(page, 'JD5162')).toHaveCount(0);
  await field(page, 'Airline').selectOption({ label: 'China Southern' });
  await expect(region(page, 'Flight list').getByRole('listitem')).toHaveCount(1);
  await visible(flight(page, 'CZ3401'));
});

