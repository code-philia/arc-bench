// requirement: REQ-5.2.3
import { expect } from '@playwright/test';
import { test } from './fixtures/test';
import { entry, link, text, login, orders, defaultResults, plans } from './helpers';
test("REQ-5.2.3: Show empty History orders", async ({ page }) => {
    await entry(page);
    await login(page, 'orders_empty_user');
    await orders(page, "History orders");
    for (const name of ['Uncompleted orders', 'Upcoming trips', 'History orders'])
        await expect(page.getByRole('tab', { name, exact: true })).toHaveCount(1);
    await expect(page.getByRole('tab', { name: "History orders", exact: true })).toHaveAttribute('aria-selected', 'true');
    await expect(page.getByRole('img', { name: 'No orders', exact: true })).toBeVisible();
    await text(page, "You don't have any bookings or we can't access your bookings at this time.");
    await expect(link(page, 'Search tickets')).toBeVisible();
});
test("REQ-5.2.3: Search from empty History orders", async ({ page }) => {
    await entry(page);
    await login(page, 'orders_empty_user');
    await orders(page, "History orders");
    await link(page, "You can make travel plans through the ticket reservation function.").click();
    await defaultResults(page);
});
