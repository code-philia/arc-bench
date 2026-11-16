// requirement: REQ-9.1
import { test, heading, openHome, openAirport } from "./helpers";

test('REQ-9.1: Open airport guide', async ({ page }) => {
  await openHome(page);
  await openAirport(page);
  await heading(page, 'Airport guide');
});
