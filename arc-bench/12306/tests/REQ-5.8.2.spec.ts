// requirement: REQ-5.8.2
import { expect } from '@playwright/test';
import { test } from './fixtures/test';
import { entry, link, region, login, home, center, security } from './helpers';
test("REQ-5.8.2: Quick entry to User information", async ({ page }) => {
    await entry(page);
    await login(page, 'profile_user');
    await home(page);
    await link(page, 'My 12306').hover();
    const q = region(page, 'My 12306 quick entries');
    for (const name of ['Order center', 'User information', 'Account security', 'My passengers'])
        await expect(link(q, name)).toBeVisible();
    await link(q, "User information").click();
    await expect(region(page, 'Essential information')).toBeVisible();
});
