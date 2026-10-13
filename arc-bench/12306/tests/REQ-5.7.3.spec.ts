// requirement: REQ-5.7.3
import { expect } from '@playwright/test';
import { test } from './fixtures/test';
import { entry, button, field, text, row, login, orders, search, booking, fillDates } from './helpers';
test("REQ-5.7.3: Search history departure range", async ({ page }) => {
    await entry(page);
    await login(page, 'orders_history_user');
    await orders(page, 'History orders');
    await fillDates(page, '2026-07-19', '2026-07-21', "");
    await expect(row(page, 'G1001')).toBeVisible();
});
test("REQ-5.7.3: Exclude history outside date range", async ({ page }) => {
    await entry(page);
    await login(page, 'orders_history_user');
    await orders(page, 'History orders');
    await fillDates(page, '2026-07-20', '2026-07-21', "G1001");
    await expect(page.getByRole('img', { name: 'No orders', exact: true })).toBeVisible();
    await expect(row(page, 'G1001')).not.toBeVisible();
});
test("REQ-5.7.3: Exclude history nonmatching keyword", async ({ page }) => {
    await entry(page);
    await login(page, 'orders_history_user');
    await orders(page, 'History orders');
    await fillDates(page, '2026-07-19', '2026-07-21', "Z9999");
    await expect(page.getByRole('img', { name: 'No orders', exact: true })).toBeVisible();
    await expect(row(page, 'G1001')).not.toBeVisible();
});
test("REQ-5.7.3: Reject invalid history keyword", async ({ page }) => {
    await entry(page);
    await login(page, 'orders_history_user');
    await orders(page, 'History orders');
    await page.getByPlaceholder('Order number/train number/name', { exact: true }).fill('***');
    await button(page, 'Search').click();
    await text(page, 'Please enter a valid search condition.');
});
