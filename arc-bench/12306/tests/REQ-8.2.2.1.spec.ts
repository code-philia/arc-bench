// requirement: REQ-8.2.2.1
import { expect } from '@playwright/test';
import { test } from './fixtures/test';
import { entry, button, field, row, booking, checkHeaders } from './helpers';
test("REQ-8.2.2.1: Select and configure booking passenger", async ({ page }) => {
    await entry(page);
    await booking(page, 'bookable_user');
    await page.getByRole('checkbox', { name: 'Passenger Example', exact: true }).check();
    const table = page.getByRole('table', { name: 'Booking passengers', exact: true });
    await checkHeaders(table, ['Ticket class', 'Ticket type', 'Name', 'ID type', 'ID number', 'Nationality', 'Operation']);
    const r = row(table, 'P20269997');
    await expect(r).toHaveCount(1);
    await expect(r).toContainText('Passenger Example');
    await field(r, 'Ticket class').selectOption({ label: 'Business-class seat' });
    await field(r, 'Ticket type').selectOption({ label: 'Adult' });
    await expect(field(r, 'Ticket class').getByRole('option', { name: 'Business-class seat', exact: true, selected: true })).toHaveCount(1);
    await expect(field(r, 'Ticket type').getByRole('option', { name: 'Adult', exact: true, selected: true })).toHaveCount(1);
    await expect(button(r, 'Delete')).toBeVisible();
    await expect(button(page, 'Place order')).toBeVisible();
});
test("REQ-8.2.2.1: Configure a child booking ticket", async ({ page }) => {
    await entry(page);
    await booking(page, 'bookable_user');
    await page.getByRole('checkbox', { name: 'Passenger Example', exact: true }).check();
    const r = row(page.getByRole('table', { name: 'Booking passengers', exact: true }), 'P20269997');
    await field(r, 'Ticket type').selectOption({ label: 'Child' });
    await expect(field(r, 'Ticket type').getByRole('option', { name: 'Child', exact: true, selected: true })).toHaveCount(1);
    await expect(r).toHaveCount(1);
    await expect(r).toContainText('Passenger Example');
});
