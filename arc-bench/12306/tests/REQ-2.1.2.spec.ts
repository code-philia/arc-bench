// requirement: REQ-2.1.2
import { expect } from '@playwright/test';
import { test } from './fixtures/test';
import { entry, link, login, register, signOutIfSignedIn, text } from './helpers';
import { newAccount } from './fixtures/data';
test("REQ-2.1.2: Create durable account", async ({ page }) => {
    await entry(page);
    const account = newAccount();
    await register(page, account);
    await text(page, 'Registration successful.');
    await signOutIfSignedIn(page);
    await page.reload();
    await login(page, account.username, account.password);
    await page.reload();
    await expect(link(page, 'Sign Out')).toBeVisible();
});
