// requirement: REQ-5.8.3
import { expect } from '@playwright/test';
import { test } from './fixtures/test';
import { entry, link, region, login, home, center, security } from './helpers';
test("REQ-5.8.3: Quick entry to Account security", async ({ page }) => {
    await entry(page);
    await login(page, 'profile_user');
    await home(page);
    await link(page, 'My 12306').hover();
    const q = region(page, 'My 12306 quick entries');
    for (const name of ['Order center', 'User information', 'Account security', 'My passengers'])
        await expect(link(q, name)).toBeVisible();
    await link(q, "Account security").click();
    await expect(region(page, 'Security mailbox')).toBeVisible();
});
