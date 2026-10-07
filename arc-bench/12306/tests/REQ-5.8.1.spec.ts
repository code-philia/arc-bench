// requirement: REQ-5.8.1
import { expect } from '@playwright/test';
import { test } from './fixtures/test';
import { entry, link, region, login, home, center, orders, security } from './helpers';
test("REQ-5.8.1: Quick entry to Order center", async ({ page }) => {
    await entry(page);
    await login(page, 'profile_user');
    await home(page);
    await link(page, 'My 12306').hover();
    const q = region(page, 'My 12306 quick entries');
    for (const name of ['Order center', 'User information', 'Account security', 'My passengers'])
        await expect(link(q, name)).toBeVisible();
    await link(q, "Order center").click();
    await expect(page.getByRole('tab', { name: 'Uncompleted orders', exact: true })).toBeVisible();
    await expect(page.getByRole('tab', { name: 'Upcoming trips', exact: true })).toBeVisible();
    await expect(page.getByRole('tab', { name: 'History orders', exact: true })).toBeVisible();
});
