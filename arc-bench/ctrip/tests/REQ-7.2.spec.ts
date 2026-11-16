// requirement: REQ-7.2
import { test, region, textVisible, visible, openHome, openStatus, queryStatusNumber } from "./helpers";

test('REQ-7.2: Show identified flight ground service details', async ({ page }) => {
  await openHome(page);
  await openStatus(page);
  await queryStatusNumber(page, 'JD5162');
  const details = region(page, 'Flight details');
  for (const value of ['JD5162', 'Chengdu', 'Guangzhou', 'Scheduled', 'H14-H25', 'B12']) await textVisible(details, value);
  const grouped = region(details, 'Baggage carousel').getByText('6', { exact: true });
  const description = details.locator('dt').and(details.getByText('Baggage carousel', { exact: true }))
    .locator('xpath=following-sibling::*[1][self::dd]')
    .and(details.getByText('6', { exact: true }));
  await visible(grouped.or(description));
});
