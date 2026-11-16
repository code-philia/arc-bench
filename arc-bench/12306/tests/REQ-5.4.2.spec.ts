// requirement: REQ-5.4.2
import { expect } from '@playwright/test';
import { test, travelDate } from './fixtures/test';
import { button, checkHeaders, entry, orderRow, orderSetup, orders } from './helpers';
import { bookingAccounts } from './fixtures/data';
test("REQ-5.4.2: Inspect upcoming table", async ({ page }) => {
    await entry(page);
    const journey = await orderSetup(page, bookingAccounts.upcoming, travelDate(page, 1), true);
    await orders(page, 'Upcoming trips');
    await checkHeaders(page, ['Train No.', 'Departure date', 'Departure station', 'Arrival station', 'Operation']);
    await expect(button(orderRow(page, journey), 'Refund')).toBeVisible();
});
