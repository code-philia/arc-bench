// requirement: REQ-2.2.2
import { expect } from '@playwright/test';
import { test } from './fixtures/test';
import { entry, link, button, field, login } from './helpers';
test("REQ-2.2.2: Open registration from login", async ({ page }) => {
    await entry(page);
    await link(page, 'Login').click();
    await link(page, 'No account yet? Register now.').click();
    await expect(field(page, 'Nationality')).toBeVisible();
    await expect(field(page, 'Passport number')).toBeVisible();
    await expect(button(page, 'Register')).toBeVisible();
});
