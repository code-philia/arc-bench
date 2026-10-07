// requirement: REQ-5.4.2
import { expect } from '@playwright/test';
import { test } from './fixtures/test';
import { entry, button, field, text, row, orders, search, booking, orderSetup, fillDates } from './helpers';
test("REQ-5.4.2: Search by departure range", async ({ page }) => {
    await entry(page);
    await orderSetup(page, 'orders_upcoming_user', '2026-07-22', true);
    await orders(page, 'Upcoming trips');
    await fillDates(page, '2026-07-21', '2026-08-21', "");
    await expect(row(page, 'G1001')).toBeVisible();
});
test("REQ-5.4.2: Intersect departure range and keyword", async ({ page }) => {
    await entry(page);
    await orderSetup(page, 'orders_upcoming_user', '2026-07-22', true);
    await orders(page, 'Upcoming trips');
    await fillDates(page, '2026-07-21', '2026-08-21', "G1001");
    await expect(row(page, 'G1001')).toBeVisible();
});
test("REQ-5.4.2: Exclude nonmatching date range", async ({ page }) => {
    await entry(page);
    await orderSetup(page, 'orders_upcoming_user', '2026-07-22', true);
    await orders(page, 'Upcoming trips');
    await fillDates(page, '2026-07-23', '2026-08-21', "G1001");
    await expect(page.getByRole('img', { name: 'No orders', exact: true })).toBeVisible();
    await expect(row(page, 'G1001')).not.toBeVisible();
});
test("REQ-5.4.2: Exclude nonmatching keyword", async ({ page }) => {
    await entry(page);
    await orderSetup(page, 'orders_upcoming_user', '2026-07-22', true);
    await orders(page, 'Upcoming trips');
    await fillDates(page, '2026-07-21', '2026-08-21', "Z9999");
    await expect(page.getByRole('img', { name: 'No orders', exact: true })).toBeVisible();
    await expect(row(page, 'G1001')).not.toBeVisible();
});
test("REQ-5.4.2: Reject invalid upcoming keyword", async ({ page }) => {
    await entry(page);
    await orderSetup(page, 'orders_upcoming_user', '2026-07-22', true);
    await orders(page, 'Upcoming trips');
    await page.getByPlaceholder('Order number/train number/name', { exact: true }).fill('***');
    await button(page, 'Search').click();
    await text(page, 'Please enter a valid search condition.');
});
test("REQ-5.4.2: Search by booking date", async ({ page }) => {
    await entry(page);
    await orderSetup(page, 'orders_upcoming_user', '2026-07-22', true);
    await orders(page, 'Upcoming trips');
    await field(page, 'Order date type').selectOption({ label: 'Search by booking date' });
    await field(page, 'Start date').fill('2026-07-21');
    await field(page, 'End date').fill('2026-07-21');
    await page.getByPlaceholder('Order number/train number/name', { exact: true }).fill('G1001');
    await button(page, 'Search').click();
    await expect(row(page, 'G1001')).toBeVisible();
});
