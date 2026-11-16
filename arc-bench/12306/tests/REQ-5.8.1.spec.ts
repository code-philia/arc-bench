// requirement: REQ-5.8.1
import { expect } from '@playwright/test';
import { test } from './fixtures/test';
import { createAccount, entry, home, link, quickEntries, tab } from './helpers';
test("REQ-5.8.1: Quick entry to Order center", async ({ page }) => {
    await entry(page);
    await createAccount(page);
    await home(page);
    const q = await quickEntries(page);
    for (const name of ['Order center', 'User information', 'Account security', 'My passengers'])
        await expect(link(q, name)).toBeVisible();
    await link(q, "Order center").click();
    await expect(tab(page, 'Uncompleted orders')).toBeVisible();
    await expect(tab(page, 'Upcoming trips')).toBeVisible();
    await expect(tab(page, 'History orders')).toBeVisible();
});
