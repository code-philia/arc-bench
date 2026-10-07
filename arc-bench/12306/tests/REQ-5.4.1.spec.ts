// requirement: REQ-5.4.1
import { expect } from '@playwright/test';
import { test } from './fixtures/test';
import { entry, button, row, orders, orderSetup, checkHeaders } from './helpers';
test("REQ-5.4.1: Inspect upcoming table", async ({ page }) => {
    await entry(page);
    await orderSetup(page, 'orders_upcoming_user', '2026-07-22', true);
    await orders(page, 'Upcoming trips');
    await checkHeaders(page, ['Train No.', 'Departure date', 'Departure station', 'Arrival station', 'Operation']);
    await expect(button(row(page, 'G1001'), 'Refund')).toBeVisible();
});
