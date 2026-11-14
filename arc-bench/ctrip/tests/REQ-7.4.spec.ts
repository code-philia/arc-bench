// requirement: REQ-7.4
import { test, expectDateField, action, region, textVisible, openHome, openStatus, queryStatusNumber, field, tripDate, registerAccount } from "./helpers";

test('REQ-7.4: Record and reuse a flight query', async ({ page }) => {
  await openHome(page);
  await registerAccount(page);
  await openStatus(page);
  await queryStatusNumber(page, 'JD5162');
  await openStatus(page);
  await action(region(page, 'Search history'), 'JD5162').click();
  await expectDateField(field(page, 'Departure date'), tripDate(page, 2));
  for (const value of ['JD5162', 'Chengdu', 'Guangzhou']) await textVisible(region(page, 'Flight details'), value);
});
