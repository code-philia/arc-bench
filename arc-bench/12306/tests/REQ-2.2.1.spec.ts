// requirement: REQ-2.2.1
import { expect } from '@playwright/test';
import { test } from './fixtures/test';
import { entry, link, text, login } from './helpers';
test("REQ-2.2.1: Authenticate by username email and mobile", async ({ page }) => {
    await entry(page);
    for (const identity of ['registered_user', 'registered_user@example.com', '13800000010']) {
        await login(page, identity);
        await expect(page.getByRole('status')).toContainText('Login successful');
        await page.reload();
        await expect(link(page, 'Sign Out')).toBeVisible();
        await link(page, 'Sign Out').click();
        await expect(link(page, 'Login')).toBeVisible();
        await expect(link(page, 'Sign Out')).not.toBeVisible();
    }
});
test("REQ-2.2.1: Reject empty credentials", async ({ page }) => {
    await entry(page);
    await login(page, "", "", false);
    await text(page, "Please enter your username/email/phone number and password.");
    await expect(link(page, 'Sign Out')).not.toBeVisible();
});
test("REQ-2.2.1: Reject unknown account", async ({ page }) => {
    await entry(page);
    await login(page, "unknown_account", "Password123!", false);
    await text(page, "User not found.");
    await expect(link(page, 'Sign Out')).not.toBeVisible();
});
test("REQ-2.2.1: Reject wrong password", async ({ page }) => {
    await entry(page);
    await login(page, "registered_user", "WrongPassword123!", false);
    await text(page, "Incorrect password.");
    await expect(link(page, 'Sign Out')).not.toBeVisible();
});
test("REQ-2.2.1: Reject missing password", async ({ page }) => {
    await entry(page);
    await login(page, "registered_user", "", false);
    await text(page, 'Please enter your username/email/phone number and password.');
    await expect(link(page, 'Sign Out')).not.toBeVisible();
});
test("REQ-2.2.1: Reject missing account", async ({ page }) => {
    await entry(page);
    await login(page, "", "Password123!", false);
    await text(page, 'Please enter your username/email/phone number and password.');
    await expect(link(page, 'Sign Out')).not.toBeVisible();
});
