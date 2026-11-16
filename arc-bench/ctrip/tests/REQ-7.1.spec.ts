// requirement: REQ-7.1
import { test, radio, visible, heading, openHome, openStatus } from "./helpers";

test('REQ-7.1: Open flight status service', async ({ page }) => {
  await openHome(page);
  await openStatus(page);
  await heading(page, 'Flight status');
  await visible(radio(page, 'Flight number'));
  await visible(radio(page, 'Route'));
});
