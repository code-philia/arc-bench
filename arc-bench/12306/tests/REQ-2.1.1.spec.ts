// requirement: REQ-2.1.1
import { expect } from '@playwright/test';
import { test } from './fixtures/test';
import { entry, link, text, register, login, home } from './helpers';
test("REQ-2.1.1: Create durable account", async ({ page }) => {
    await entry(page);
    await register(page);
    await text(page, 'Registration successful.');
    await home(page);
    if (await link(page, 'Sign Out').isVisible())
        await link(page, 'Sign Out').click();
    await page.reload();
    await login(page, 'traveler_new');
    await page.reload();
    await expect(link(page, 'Sign Out')).toBeVisible();
});
