// requirement: REQ-5.8.2
import { expect } from '@playwright/test';
import { test } from './fixtures/test';
import { createAccount, entry, home, link, quickEntries, region } from './helpers';
test("REQ-5.8.2: Quick entry to User information", async ({ page }) => {
    await entry(page);
    await createAccount(page);
    await home(page);
    const q = await quickEntries(page);
    for (const name of ['Order center', 'User information', 'Account security', 'My passengers'])
        await expect(link(q, name)).toBeVisible();
    await link(q, "User information").click();
    await expect(region(page, 'Essential information')).toBeVisible();
});
