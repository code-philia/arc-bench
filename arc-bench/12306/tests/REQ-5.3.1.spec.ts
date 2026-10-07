// requirement: REQ-5.3.1
import { expect } from '@playwright/test';
import { test } from './fixtures/test';
import { entry, button, row, orders, orderSetup, checkHeaders } from './helpers';
test("REQ-5.3.1: Inspect unpaid order table", async ({ page }) => {
    await entry(page);
    await orderSetup(page, 'orders_unpaid_user');
    await orders(page, 'Uncompleted orders');
    await checkHeaders(page, ['Train No.', 'Departure date', 'Departure station', 'Arrival station', 'Operation']);
    const r = row(page, 'G1001');
    await expect(r).toContainText('Shanghai');
    await expect(r).toContainText('Beijing');
    await expect(button(r, 'Pay')).toBeVisible();
});
