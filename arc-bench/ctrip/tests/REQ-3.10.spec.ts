// requirement: REQ-3.10
import { test, setChecked, region, expectSelectedPassenger, textVisible, total, openHome, openBooking, registerAccount, openCommon, travelerInput, createTraveler, recordCheckbox } from "./helpers";

test('REQ-3.10: Remove one selected frequent passenger', async ({ page }) => {
  await openHome(page);
  await registerAccount(page);
  await openCommon(page, undefined, 'Travelers');
  const first = travelerInput('Frequent traveler');
  const second = travelerInput('Frequent traveler');
  await createTraveler(page, first);
  await createTraveler(page, second);
  await openHome(page);
  await openBooking(page);
  await setChecked(recordCheckbox(region(page, 'Frequent passengers'), first.name));
  await setChecked(recordCheckbox(region(page, 'Frequent passengers'), second.name));
  await total(page, 1060);
  await setChecked(recordCheckbox(region(page, 'Frequent passengers'), second.name), false);
  await expectSelectedPassenger(page, first.name);
  await expectSelectedPassenger(page, second.name, false);
  await textVisible(region(page, 'Fee breakdown'), 'Passengers: 1');
  await total(page, 530);
});
