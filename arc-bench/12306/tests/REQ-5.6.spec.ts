// requirement: REQ-5.6
import { expect } from '@playwright/test';
import { test } from './fixtures/test';
import { entry, link, login, center } from './helpers';
test("REQ-5.6: Open Upcoming trips through Refund quick entry", async ({ page }) => {
    await entry(page);
    await login(page, 'orders_upcoming_user');
    await link(page.getByRole('navigation'), 'Booking').hover();
    await link(page, 'Refund').click();
    await expect(link(page.getByRole('navigation', { name: 'Personal center menu', exact: true }), 'Order center')).toBeVisible();
    await expect(page.getByRole('tab', { name: 'Upcoming trips', exact: true })).toHaveAttribute('aria-selected', 'true');
});
