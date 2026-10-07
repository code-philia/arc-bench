// requirement: REQ-8.3.2.1
import { expect } from '@playwright/test';
import { test } from './fixtures/test';
import { entry, button, text, region, confirmation, payment } from './helpers';
test("REQ-8.3.2.1: Confirm order and reach payment", async ({ page }) => {
    await entry(page);
    await confirmation(page, 'booking_confirm_user');
    await button(page.getByRole('dialog', { name: 'Please confirm the following information.', exact: true }), 'Confirm').click();
    await text(page, 'Order submitted successfully.');
    await expect(region(page, 'Order details')).toContainText('G1001');
    await expect(region(page, 'Order details')).toContainText('Passenger Example');
});
