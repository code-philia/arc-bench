// requirement: REQ-8.2.3.2
import { expect } from '@playwright/test';
import { test } from './fixtures/test';
import { booking, bookingPassengers, button, confirmationDialog, entry, row, selectPassenger, text } from './helpers';
import { bookingAccounts } from './fixtures/data';
test("REQ-8.2.3.2: Remove selected booking passenger", async ({ page }) => {
    await entry(page);
    const journey = await booking(page, bookingAccounts.inspect);
    const selected = await selectPassenger(page, journey.passenger);
    const table = bookingPassengers(page);
    await button(selected, 'Delete').click();
    await expect(row(table, journey.passenger.passport)).toHaveCount(0);
    await button(page, 'Place order').click();
    await text(page, 'Please select at least one passenger.');
    await expect(confirmationDialog(page)).not.toBeVisible();
    await selectPassenger(page, journey.passenger);
});
