// requirement: REQ-2.11
import { expect } from "@playwright/test";
import { test, button, region, visible, economyFare, openHome, submitFlightSearch } from "./helpers";
import { flightEntry, preferredVisible } from "./ui";

test('REQ-2.11: Expand and collapse the selected flight fare', async ({ page }) => {
  await openHome(page);
  await submitFlightSearch(page);
  const selectedFlight = await preferredVisible(
    page.getByRole('listitem', { name: 'Flight JD5162', exact: true }),
    flightEntry(page, 'JD5162'),
  );
  const optionsLabel = selectedFlight.getByText('Fare options', { exact: true });
  const optionsRegion = region(selectedFlight, 'Fare options').filter({ visible: true });
  const rulesText = /\bRefund and change rules\b/i;

  await button(selectedFlight, 'Show fares').click();
  await preferredVisible(optionsLabel, optionsRegion);
  const fareScope = await optionsRegion.count() ? optionsRegion : selectedFlight;
  const economy = await economyFare(fareScope);
  await expect(fareScope.getByText(rulesText).filter({ visible: true })).not.toHaveCount(0);

  await button(selectedFlight, 'Hide fares').click();
  await expect(optionsLabel.or(optionsRegion).filter({ visible: true })).toHaveCount(0);
  await expect(economy).toHaveCount(0);
  await expect(selectedFlight.getByText(rulesText).filter({ visible: true })).toHaveCount(0);
  await visible(button(selectedFlight, 'Show fares'));
});
