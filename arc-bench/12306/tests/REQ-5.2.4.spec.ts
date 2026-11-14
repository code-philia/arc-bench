// requirement: REQ-5.2.4
import { expect } from '@playwright/test';
import { test } from './fixtures/test';
import { createAccount, defaultResults, entry, link, orders, picture, selectedTab, tab, text } from './helpers';
test("REQ-5.2.4: Show empty History orders", async ({ page }) => {
    await entry(page);
    await createAccount(page);
    await orders(page, "History orders");
    for (const name of ['Uncompleted orders', 'Upcoming trips', 'History orders'])
        await expect(tab(page, name)).toHaveCount(1);
    await expect(selectedTab(page, "History orders")).toBeVisible();
    await expect(picture(page, 'No orders')).toBeVisible();
    await text(page, "You don't have any bookings or we can't access your bookings at this time.");
    await expect(link(page, 'Search tickets')).toBeVisible();
});
test("REQ-5.2.4: Search from empty History orders", async ({ page }) => {
    await entry(page);
    await createAccount(page);
    await orders(page, "History orders");
    await link(page, "You can make travel plans through the ticket reservation function.").click();
    await defaultResults(page);
});
