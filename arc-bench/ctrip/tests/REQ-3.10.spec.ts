// requirement: REQ-3.10
import { expect } from "@playwright/test";
import { test, setChecked, region, record, records, visible, textVisible, total, openHome, openBooking, registerAccount, openCommon, travelerInput, createTraveler, recordCheckbox } from "./helpers";

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
  await expect(records(region(page, 'Selected passengers'))).toHaveCount(1);
  await visible(record(region(page, 'Selected passengers'), first.name));
  await expect(record(region(page, 'Selected passengers'), second.name)).toHaveCount(0);
  await textVisible(region(page, 'Fee breakdown'), 'Passengers: 1');
  await total(page, 530);
});
