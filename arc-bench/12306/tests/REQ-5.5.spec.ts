// requirement: REQ-5.5
import { expect } from '@playwright/test';
import { test, travelDate } from './fixtures/test';
import { button, entry, link, orderRow, orderSetup, orders, region, statusMessage } from './helpers';
import { additionalTrain, bookingAccounts } from './fixtures/data';
test("REQ-5.5: Refund and inspect history", async ({ page }) => {
    await entry(page);
    const journey = await orderSetup(page, bookingAccounts.refund, travelDate(page, 1), true, additionalTrain);
    await orders(page, 'Upcoming trips');
    await button(orderRow(page, journey), 'Refund').click();
    await expect(region(page, 'Refund information')).toContainText(journey.train);
    await expect(region(page, 'Refund information')).toContainText('Refund amount');
    await button(page, 'Confirm refund').click();
    await expect(statusMessage(page, 'Refund successful')).toBeVisible();
    journey.state = 'closed';
    await link(page, 'View History orders').click();
    await expect(orderRow(page, journey)).toContainText('refunded');
    await page.reload();
    await expect(orderRow(page, journey)).toContainText('refunded');
});
