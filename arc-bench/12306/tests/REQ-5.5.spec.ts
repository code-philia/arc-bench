// requirement: REQ-5.5
import { expect } from '@playwright/test';
import { test, travelDate } from './fixtures/test';
import { button, dialog, entry, link, orderRow, orderSetup, orders, region, statusMessage } from './helpers';
import { additionalTrain, bookingAccounts } from './fixtures/data';
test("REQ-5.5: Refund and inspect history", async ({ page }) => {
    await entry(page);
    const journey = await orderSetup(page, bookingAccounts.refund, travelDate(page, 1), true, additionalTrain);
    await orders(page, 'Upcoming trips');
    await button(orderRow(page, journey), 'Refund').click();
    const info = region(page, 'Refund information').or(dialog(page, 'Refund information'))
        .filter({ has: button(page, 'Confirm refund') });
    await expect(info).toContainText(journey.train);
    await expect(info).toContainText('Refund amount');
    await button(info, 'Confirm refund').click();
    await expect(statusMessage(page, 'Refund successful').or(dialog(page, 'Refund successful'))).toBeVisible();
    journey.state = 'closed';
    await link(page, 'View History orders').click();
    const refunded = orderRow(page, journey).getByRole('cell', { name: /^refunded$/i });
    await expect(refunded).toBeVisible();
    await page.reload();
    await expect(refunded).toBeVisible();
});
