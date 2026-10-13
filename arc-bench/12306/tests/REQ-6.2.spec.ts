// requirement: REQ-6.2
import { expect } from '@playwright/test';
import { test } from './fixtures/test';
import { entry, link, button, field, region, login, home, section, PASS } from './helpers';
test("REQ-6.2: Reject invalid essential password", async ({ page }) => {
    await entry(page);
    await login(page, 'profile_invalid_password_user');
    await section(page, 'Personal', 'User information');
    const r = region(page, 'Essential information');
    await button(r, 'Edit').click();
    await field(r, 'Password').fill('bad');
    await button(r, 'Save').click();
    await expect(r).toContainText('Please enter a valid password.');
    await expect(button(r, 'Save')).toBeVisible();
    await page.reload();
    await expect(r).toContainText('Male');
    await home(page);
    await link(page, 'Sign Out').click();
    await login(page, 'profile_invalid_password_user');
});
