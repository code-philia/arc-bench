// requirement: REQ-8.3.2
import { expect } from '@playwright/test';
import { test } from './fixtures/test';
import { booking, button, confirmation, confirmationDialog, entry, field, selectChoice, selectPassenger, text } from './helpers';
import { bookingAccounts } from './fixtures/data';
test("REQ-8.3.2: Open confirmation for available seat", async ({ page }) => {
    await entry(page);
    const journey = await confirmation(page, bookingAccounts.submit);
    const d = confirmationDialog(page);
    await expect(d).toContainText(journey.train);
    await expect(d).toContainText(journey.passenger.name);
    await expect(button(d, 'Confirm')).toBeVisible();
    await expect(button(d, 'Edit')).toBeVisible();
});
test("REQ-8.3.2: Reject no passenger", async ({ page }) => {
    await entry(page);
    await booking(page, bookingAccounts.inspect);
    await button(page, 'Place order').click();
    await text(page, "Please select at least one passenger.");
    await expect(confirmationDialog(page)).not.toBeVisible();
});
test("REQ-8.3.2: Reject unavailable ticket class", async ({ page }) => {
    await entry(page);
    const journey = await booking(page, bookingAccounts.inspect);
    const selected = await selectPassenger(page, journey.passenger);
    await selectChoice(field(selected, 'Ticket class'), 'Second-class seat');
    await button(page, 'Place order').click();
    await text(page, "Sorry, there are no tickets available for the selected ticket class.");
    await expect(confirmationDialog(page)).not.toBeVisible();
});
