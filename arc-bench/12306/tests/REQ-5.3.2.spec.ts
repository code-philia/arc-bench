// requirement: REQ-5.3.2
import { expect } from '@playwright/test';
import { test } from './fixtures/test';
import { entry, button, row, region, orders, payment, orderSetup } from './helpers';
test("REQ-5.3.2: Resume payment by order identity", async ({ page }) => {
    await entry(page);
    await orderSetup(page, 'orders_unpaid_user');
    await orders(page, 'Uncompleted orders');
    await button(row(page, 'G1001'), 'Pay').click();
    await expect(region(page, 'Order details')).toContainText('G1001');
    await expect(region(page, 'Payment information')).toBeVisible();
});
