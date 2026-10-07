// requirement: REQ-5.2.2
import { expect } from '@playwright/test';
import { test } from './fixtures/test';
import { entry, link, text, login, orders, defaultResults, plans } from './helpers';
test("REQ-5.2.2: Show empty Upcoming trips", async ({ page }) => {
    await entry(page);
    await login(page, 'orders_empty_user');
    await orders(page, "Upcoming trips");
    for (const name of ['Uncompleted orders', 'Upcoming trips', 'History orders'])
        await expect(page.getByRole('tab', { name, exact: true })).toHaveCount(1);
    await expect(page.getByRole('tab', { name: "Upcoming trips", exact: true })).toHaveAttribute('aria-selected', 'true');
    await expect(page.getByRole('img', { name: 'No orders', exact: true })).toBeVisible();
    await text(page, "You don't have any bookings or we can't access your bookings at this time.");
});
test("REQ-5.2.2: Search from empty Upcoming trips", async ({ page }) => {
    await entry(page);
    await login(page, 'orders_empty_user');
    await orders(page, "Upcoming trips");
    await link(page, "You can make travel plans through the ticket reservation function.").click();
    await defaultResults(page);
});
