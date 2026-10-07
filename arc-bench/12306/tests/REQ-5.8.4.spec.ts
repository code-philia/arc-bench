// requirement: REQ-5.8.4
import { expect } from '@playwright/test';
import { test } from './fixtures/test';
import { entry, link, button, region, login, home, center, security } from './helpers';
test("REQ-5.8.4: Quick entry to My passengers", async ({ page }) => {
    await entry(page);
    await login(page, 'profile_user');
    await home(page);
    await link(page, 'My 12306').hover();
    const q = region(page, 'My 12306 quick entries');
    for (const name of ['Order center', 'User information', 'Account security', 'My passengers'])
        await expect(link(q, name)).toBeVisible();
    await link(q, "My passengers").click();
    await expect(button(page, 'Add new passengers')).toBeVisible();
});
