// requirement: REQ-3.1
import { test, button, region, textVisible, openHome, openBooking } from "./helpers";

test('REQ-3.1: Expand airline travel reminders', async ({ page }) => {
  await openHome(page);
  await openBooking(page);
  await button(region(page, 'Travel reminders'), 'Show reminder details').click();
  await textVisible(region(page, 'Travel reminders'), 'Power banks');
  await textVisible(region(page, 'Travel reminders'), 'Baggage allowance');
});
