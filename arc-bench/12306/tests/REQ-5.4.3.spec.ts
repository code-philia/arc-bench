// requirement: REQ-5.4.3
import { expect } from '@playwright/test';
import { test, travelDate } from './fixtures/test';
import { button, entry, fillDates, orderKeyword, orderRow, orderSetup, orders, picture, text } from './helpers';
import { bookingAccounts } from './fixtures/data';
test("REQ-5.4.3: Search by departure range", async ({ page }) => {
    await entry(page);
    const journey = await orderSetup(page, bookingAccounts.upcoming, travelDate(page, 1), true);
    await orders(page, 'Upcoming trips');
    await fillDates(page, travelDate(page), travelDate(page, 31), "");
    await expect(orderRow(page, journey)).toBeVisible();
});
test("REQ-5.4.3: Exclude nonmatching date range", async ({ page }) => {
    await entry(page);
    const journey = await orderSetup(page, bookingAccounts.upcoming, travelDate(page, 1), true);
    await orders(page, 'Upcoming trips');
    await fillDates(page, travelDate(page, 2), travelDate(page, 31), journey.train);
    await expect(picture(page, 'No orders')).toBeVisible();
    await expect(orderRow(page, journey)).not.toBeVisible();
});
test("REQ-5.4.3: Exclude nonmatching keyword", async ({ page }) => {
    await entry(page);
    const journey = await orderSetup(page, bookingAccounts.upcoming, travelDate(page, 1), true);
    await orders(page, 'Upcoming trips');
    await fillDates(page, travelDate(page), travelDate(page, 31), "Z9999");
    await expect(picture(page, 'No orders')).toBeVisible();
    await expect(orderRow(page, journey)).not.toBeVisible();
});
test("REQ-5.4.3: Reject invalid upcoming keyword", async ({ page }) => {
    await entry(page);
    await orderSetup(page, bookingAccounts.upcoming, travelDate(page, 1), true);
    await orders(page, 'Upcoming trips');
    await orderKeyword(page).fill('***');
    await button(page, 'Search').click();
    await text(page, 'Please enter a valid search condition.');
});
