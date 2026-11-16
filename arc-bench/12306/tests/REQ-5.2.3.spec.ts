// requirement: REQ-5.2.3
import { expect } from '@playwright/test';
import { test } from './fixtures/test';
import { createAccount, defaultResults, entry, link, orders, picture, selectedTab, tab, text } from './helpers';
test("REQ-5.2.3: Show empty Upcoming trips", async ({ page }) => {
    await entry(page);
    await createAccount(page);
    await orders(page, "Upcoming trips");
    for (const name of ['Uncompleted orders', 'Upcoming trips', 'History orders'])
        await expect(tab(page, name)).toHaveCount(1);
    await expect(selectedTab(page, "Upcoming trips")).toBeVisible();
    await expect(picture(page, 'No orders')).toBeVisible();
    await text(page, "You don't have any bookings or we can't access your bookings at this time.");
});
test("REQ-5.2.3: Search from empty Upcoming trips", async ({ page }) => {
    await entry(page);
    await createAccount(page);
    await orders(page, "Upcoming trips");
    await link(page, "You can make travel plans through the ticket reservation function.").click();
    await defaultResults(page);
});
