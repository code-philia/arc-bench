// requirement: REQ-5.7.2
import { expect } from '@playwright/test';
import { test } from './fixtures/test';
import { entry, button, field, text, row, login, orders, search, booking, fillDates } from './helpers';
test("REQ-5.7.2: Search history departure range", async ({ page }) => {
    await entry(page);
    await login(page, 'orders_history_user');
    await orders(page, 'History orders');
    await fillDates(page, '2026-07-19', '2026-07-21', "");
    await expect(row(page, 'G1001')).toBeVisible();
});
test("REQ-5.7.2: Intersect history date and keyword", async ({ page }) => {
    await entry(page);
    await login(page, 'orders_history_user');
    await orders(page, 'History orders');
    await fillDates(page, '2026-07-19', '2026-07-21', "G1001");
    await expect(row(page, 'G1001')).toBeVisible();
});
test("REQ-5.7.2: Exclude history outside date range", async ({ page }) => {
    await entry(page);
    await login(page, 'orders_history_user');
    await orders(page, 'History orders');
    await fillDates(page, '2026-07-20', '2026-07-21', "G1001");
    await expect(page.getByRole('img', { name: 'No orders', exact: true })).toBeVisible();
    await expect(row(page, 'G1001')).not.toBeVisible();
});
test("REQ-5.7.2: Exclude history nonmatching keyword", async ({ page }) => {
    await entry(page);
    await login(page, 'orders_history_user');
    await orders(page, 'History orders');
    await fillDates(page, '2026-07-19', '2026-07-21', "Z9999");
    await expect(page.getByRole('img', { name: 'No orders', exact: true })).toBeVisible();
    await expect(row(page, 'G1001')).not.toBeVisible();
});
test("REQ-5.7.2: Reject invalid history keyword", async ({ page }) => {
    await entry(page);
    await login(page, 'orders_history_user');
    await orders(page, 'History orders');
    await page.getByPlaceholder('Order number/train number/name', { exact: true }).fill('***');
    await button(page, 'Search').click();
    await text(page, 'Please enter a valid search condition.');
});
test("REQ-5.7.2: Search by booking date", async ({ page }) => {
    await entry(page);
    await login(page, 'orders_history_user');
    await orders(page, 'History orders');
    await field(page, 'Order date type').selectOption({ label: 'Search by booking date' });
    await field(page, 'Start date').fill('2026-07-18');
    await field(page, 'End date').fill('2026-07-18');
    await page.getByPlaceholder('Order number/train number/name', { exact: true }).fill('G1001');
    await button(page, 'Search').click();
    await expect(row(page, 'G1001')).toBeVisible();
});
