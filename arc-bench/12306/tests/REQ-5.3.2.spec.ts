// requirement: REQ-5.3.2
import { expect } from '@playwright/test';
import { test } from './fixtures/test';
import { checkHeaders, entry, orderRow, orderSetup, orders, payAction } from './helpers';
import { bookingAccounts } from './fixtures/data';
test("REQ-5.3.2: Inspect unpaid order table", async ({ page }) => {
    await entry(page);
    const journey = await orderSetup(page, bookingAccounts.resume);
    await orders(page, 'Uncompleted orders');
    await checkHeaders(page, ['Train No.', 'Departure date', 'Departure station', 'Arrival station', 'Operation']);
    const r = orderRow(page, journey);
    await expect(r).toContainText('Shanghai');
    await expect(r).toContainText('Beijing');
    await expect(payAction(r)).toBeVisible();
});
