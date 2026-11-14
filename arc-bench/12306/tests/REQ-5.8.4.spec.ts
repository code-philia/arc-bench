// requirement: REQ-5.8.4
import { expect } from '@playwright/test';
import { test } from './fixtures/test';
import { button, createAccount, entry, home, link, quickEntries } from './helpers';
test("REQ-5.8.4: Quick entry to My passengers", async ({ page }) => {
    await entry(page);
    await createAccount(page);
    await home(page);
    const q = await quickEntries(page);
    for (const name of ['Order center', 'User information', 'Account security', 'My passengers'])
        await expect(link(q, name)).toBeVisible();
    await link(q, "My passengers").click();
    await expect(button(page, 'Add new passengers')).toBeVisible();
});
