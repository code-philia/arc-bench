// requirement: REQ-5.2.2
import { expect } from '@playwright/test';
import { test } from './fixtures/test';
import { createAccount, defaultResults, entry, link, orders, picture, selectedTab, tab, text } from './helpers';
test("REQ-5.2.2: Show empty Uncompleted orders", async ({ page }) => {
    await entry(page);
    await createAccount(page);
    await orders(page, "Uncompleted orders");
    for (const name of ['Uncompleted orders', 'Upcoming trips', 'History orders'])
        await expect(tab(page, name)).toHaveCount(1);
    await expect(selectedTab(page, "Uncompleted orders")).toBeVisible();
    await expect(picture(page, 'No orders')).toBeVisible();
    await text(page, "You don't have uncompleted orders.");
});
test("REQ-5.2.2: Search from empty Uncompleted orders", async ({ page }) => {
    await entry(page);
    await createAccount(page);
    await orders(page, "Uncompleted orders");
    await link(page, "You can book your tickets and plan your trips.").click();
    await defaultResults(page);
});
