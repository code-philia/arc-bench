// requirement: REQ-7.2
import { test, region, textVisible, openHome, openStatus, queryStatusNumber } from "./helpers";

test('REQ-7.2: Show identified flight ground service details', async ({ page }) => {
  await openHome(page);
  await openStatus(page);
  await queryStatusNumber(page, 'JD5162');
  for (const value of ['JD5162', 'Chengdu', 'Guangzhou', 'Scheduled', 'H14-H25', 'B12']) await textVisible(region(page, 'Flight details'), value);
  await textVisible(region(region(page, 'Flight details'), 'Baggage carousel'), '6');
});
