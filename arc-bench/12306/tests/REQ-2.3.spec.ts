// requirement: REQ-2.3
import { expect } from '@playwright/test';
import { test } from './fixtures/test';
import { entry, link, text, login } from './helpers';
test("REQ-2.3: Clear persisted login", async ({ page }) => {
    await entry(page);
    await login(page);
    await link(page, 'Sign Out').click();
    await text(page, 'Logout successful.');
    await page.reload();
    await expect(link(page, 'Login')).toBeVisible();
    await expect(link(page, 'Register')).toBeVisible();
    await expect(link(page, 'Sign Out')).not.toBeVisible();
});
