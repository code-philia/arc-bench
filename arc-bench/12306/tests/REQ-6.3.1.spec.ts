// requirement: REQ-6.3.1
import { expect } from '@playwright/test';
import { test } from './fixtures/test';
import { entry, button, field, region, login, section } from './helpers';
test("REQ-6.3.1: Save contact email", async ({ page }) => {
    await entry(page);
    await login(page, 'profile_contact_user');
    await section(page, 'Personal', 'User information');
    const r = region(page, 'Contact information');
    await button(r, 'Edit').click();
    await field(r, 'Email').fill('profile_contact_next@example.com');
    await button(r, 'Save').click();
    await expect(r).toContainText('profile_contact_next@example.com');
    await expect(button(r, 'Edit')).toBeVisible();
    await page.reload();
    await expect(r).toContainText('profile_contact_next@example.com');
});
