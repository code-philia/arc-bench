// requirement: REQ-5.7.1
import { expect } from '@playwright/test';
import { test } from './fixtures/test';
import { entry, row, login, orders, checkHeaders } from './helpers';
test("REQ-5.7.1: Inspect completed historical order", async ({ page }) => {
    await entry(page);
    await login(page, 'orders_history_user');
    await orders(page, 'History orders');
    await checkHeaders(page, ['Train Information', 'Passenger Information', 'Seat Information', 'Price', 'Status', 'Total Price']);
    await expect(row(page, 'G1001')).toContainText('completed');
});
