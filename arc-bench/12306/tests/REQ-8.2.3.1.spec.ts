// requirement: REQ-8.2.3.1
import { expect } from '@playwright/test';
import { test } from './fixtures/test';
import { booking, bookingPassengers, button, checkHeaders, entry, expectChoice, field, selectChoice, selectPassenger } from './helpers';
import { bookingAccounts } from './fixtures/data';
test("REQ-8.2.3.1: Select and configure booking passenger", async ({ page }) => {
    await entry(page);
    const journey = await booking(page, bookingAccounts.inspect);
    const r = await selectPassenger(page, journey.passenger);
    const table = bookingPassengers(page);
    await checkHeaders(table, ['Ticket class', 'Ticket type', 'Name', 'ID type', 'ID number', 'Nationality', 'Operation']);
    await expect(r).toHaveCount(1);
    await expect(r).toContainText(journey.passenger.name);
    await selectChoice(field(r, 'Ticket class'), 'Business-class seat');
    await selectChoice(field(r, 'Ticket type'), 'Adult');
    await expectChoice(field(r, 'Ticket class'), 'Business-class seat');
    await expectChoice(field(r, 'Ticket type'), 'Adult');
    await expect(button(r, 'Delete')).toBeVisible();
    await expect(button(page, 'Place order')).toBeVisible();
});
