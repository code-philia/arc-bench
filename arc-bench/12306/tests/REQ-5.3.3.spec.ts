// requirement: REQ-5.3.3
import { expect } from '@playwright/test';
import { test } from './fixtures/test';
import { entry, orderRow, orderSetup, orders, payAction, region } from './helpers';
import { bookingAccounts } from './fixtures/data';
test("REQ-5.3.3: Resume payment by order identity", async ({ page }) => {
    await entry(page);
    const journey = await orderSetup(page, bookingAccounts.resume);
    await orders(page, 'Uncompleted orders');
    await payAction(orderRow(page, journey)).click();
    await expect(region(page, 'Order details')).toContainText(journey.train);
    await expect(region(page, 'Order details')).toContainText(journey.passenger.name);
    await expect(region(page, 'Payment information')).toBeVisible();
});
