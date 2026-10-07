// requirement: REQ-5.5
import { expect } from '@playwright/test';
import { test } from './fixtures/test';
import { entry, link, button, row, region, orders, orderSetup } from './helpers';
test("REQ-5.5: Refund and inspect history", async ({ page }) => {
    await entry(page);
    await orderSetup(page, 'orders_refund_user', '2026-07-22', true, 'G2002');
    await orders(page, 'Upcoming trips');
    await button(row(page, 'G2002'), 'Refund').click();
    await expect(region(page, 'Refund information')).toContainText('G2002');
    await expect(region(page, 'Refund information')).toContainText('Refund amount');
    await button(page, 'Confirm refund').click();
    await expect(page.getByRole('status')).toContainText('Refund successful');
    await link(page, 'View History orders').click();
    await expect(row(page, 'G2002')).toContainText('refunded');
    await page.reload();
    await expect(row(page, 'G2002')).toContainText('refunded');
});
