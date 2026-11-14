// requirement: REQ-5.8.3
import { expect } from '@playwright/test';
import { test } from './fixtures/test';
import { createAccount, entry, home, link, quickEntries, region } from './helpers';
test("REQ-5.8.3: Quick entry to Account security", async ({ page }) => {
    await entry(page);
    await createAccount(page);
    await home(page);
    const q = await quickEntries(page);
    for (const name of ['Order center', 'User information', 'Account security', 'My passengers'])
        await expect(link(q, name)).toBeVisible();
    await link(q, "Account security").click();
    await expect(region(page, 'Security mailbox')).toBeVisible();
});
