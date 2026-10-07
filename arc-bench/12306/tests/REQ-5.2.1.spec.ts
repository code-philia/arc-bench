// requirement: REQ-5.2.1
import { expect } from '@playwright/test';
import { test } from './fixtures/test';
import { entry, link, text, login, orders, defaultResults } from './helpers';
test("REQ-5.2.1: Show empty Uncompleted orders", async ({ page }) => {
    await entry(page);
    await login(page, 'orders_empty_user');
    await orders(page, "Uncompleted orders");
    for (const name of ['Uncompleted orders', 'Upcoming trips', 'History orders'])
        await expect(page.getByRole('tab', { name, exact: true })).toHaveCount(1);
    await expect(page.getByRole('tab', { name: "Uncompleted orders", exact: true })).toHaveAttribute('aria-selected', 'true');
    await expect(page.getByRole('img', { name: 'No orders', exact: true })).toBeVisible();
    await text(page, "You don't have uncompleted orders.");
});
test("REQ-5.2.1: Search from empty Uncompleted orders", async ({ page }) => {
    await entry(page);
    await login(page, 'orders_empty_user');
    await orders(page, "Uncompleted orders");
    await link(page, "You can book your tickets and plan your trips.").click();
    await defaultResults(page);
});
