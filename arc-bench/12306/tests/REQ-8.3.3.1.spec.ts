// requirement: REQ-8.3.3.1
import { expect } from '@playwright/test';
import { test } from './fixtures/test';
import { confirmation, entry, region, submitOrder, text } from './helpers';
import { bookingAccounts } from './fixtures/data';
test("REQ-8.3.3.1: Confirm order and reach payment", async ({ page }) => {
    await entry(page);
    const journey = await confirmation(page, bookingAccounts.confirm);
    await submitOrder(page, journey);
    await text(page, 'Order submitted successfully.');
    await expect(region(page, 'Order details')).toContainText(journey.train);
    await expect(region(page, 'Order details')).toContainText(journey.passenger.name);
});
