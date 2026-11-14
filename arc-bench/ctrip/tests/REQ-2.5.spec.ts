// requirement: REQ-2.5
import { test, setChecked, checkbox, heading, textVisible, openHome, searchFlights, expectChoice, selectChoice } from "./helpers";

test('REQ-2.5: Search with children included', async ({ page }) => {
  await openHome(page);
  await setChecked(checkbox(page, 'Traveling with children'));
  await searchFlights(page);
  await heading(page, 'Flight results');
  await textVisible(page, 'Children included');
});

test('REQ-2.5: Choose Economy preference', async ({ page }) => {
  await openHome(page);
  await selectChoice(page, 'Cabin class', 'Economy');
  await searchFlights(page);
  await expectChoice(page, 'Cabin class', 'Economy');
});
