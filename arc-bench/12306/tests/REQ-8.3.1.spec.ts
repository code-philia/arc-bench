// requirement: REQ-8.3.1
import { expect } from '@playwright/test';
import { test } from './fixtures/test';
import { entry, button, field, text, row, booking, confirmation } from './helpers';
test("REQ-8.3.1: Open confirmation for available seat", async ({ page }) => {
    await entry(page);
    await confirmation(page, 'booking_submit_user');
    const d = page.getByRole('dialog', { name: 'Please confirm the following information.', exact: true });
    await expect(d).toContainText('G1001');
    await expect(d).toContainText('Passenger Example');
    await expect(button(d, 'Confirm')).toBeVisible();
    await expect(button(d, 'Edit')).toBeVisible();
});
test("REQ-8.3.1: Reject no passenger", async ({ page }) => {
    await entry(page);
    await booking(page, 'bookable_user');
    await button(page, 'Place order').click();
    await text(page, "Please select at least one passenger.");
    await expect(page.getByRole('dialog', { name: 'Please confirm the following information.', exact: true })).not.toBeVisible();
});
test("REQ-8.3.1: Reject unavailable ticket class", async ({ page }) => {
    await entry(page);
    await booking(page, 'bookable_user');
    await page.getByRole('checkbox', { name: 'Passenger Example', exact: true }).check();
    await field(row(page.getByRole('table', { name: 'Booking passengers', exact: true }), 'P20269997'), 'Ticket class').selectOption({ label: 'Second-class seat' });
    await button(page, 'Place order').click();
    await text(page, "Sorry, there are no tickets available for the selected ticket class.");
    await expect(page.getByRole('dialog', { name: 'Please confirm the following information.', exact: true })).not.toBeVisible();
});
test("REQ-8.3.1: Accept available standing ticket", async ({ page }) => {
    await entry(page);
    await booking(page, 'bookable_user');
    await page.getByRole('checkbox', { name: 'Passenger Example', exact: true }).check();
    const r = row(page.getByRole('table', { name: 'Booking passengers', exact: true }), 'P20269997');
    await field(r, 'Ticket class').selectOption({ label: 'Standing ticket' });
    await button(page, 'Place order').click();
    const d = page.getByRole('dialog', { name: 'Please confirm the following information.', exact: true });
    await expect(d).toBeVisible();
    for (const value of ['G1001', 'Passenger Example', 'Standing ticket'])
        await expect(d).toContainText(value);
    await expect(page.getByText('Sorry, there are no tickets available for the selected ticket class.', { exact: true })).not.toBeVisible();
});
