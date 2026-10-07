// requirement: REQ-6.5
import { expect } from '@playwright/test';
import { test } from './fixtures/test';
import { entry, button, field, text, login, security } from './helpers';
test("REQ-6.5: Persist security email", async ({ page }) => {
    await entry(page);
    await login(page, 'profile_mailbox_update_user');
    await security(page, 'mailbox');
    await field(page, 'New e-mail:').fill("profile_user_next@example.com");
    await field(page, 'Confirm your password:').fill("Password123!");
    await button(page, 'Determine').click();
    await text(page, "Security mailbox updated successfully.");
    await text(page, 'profile_user_next@example.com');
    await page.reload();
    await text(page, 'profile_user_next@example.com');
});
test("REQ-6.5: Reject empty mailbox change", async ({ page }) => {
    await entry(page);
    await login(page, 'profile_user');
    await security(page, 'mailbox');
    await field(page, 'New e-mail:').fill("");
    await field(page, 'Confirm your password:').fill("");
    await button(page, 'Determine').click();
    await text(page, "Please fill in the new email and password.");
    await page.reload();
    await text(page, 'profile_user@example.com');
});
test("REQ-6.5: Reject wrong mailbox password", async ({ page }) => {
    await entry(page);
    await login(page, 'profile_user');
    await security(page, 'mailbox');
    await field(page, 'New e-mail:').fill("profile_user_next@example.com");
    await field(page, 'Confirm your password:').fill("WrongPassword123!");
    await button(page, 'Determine').click();
    await text(page, "Incorrect password.");
    await page.reload();
    await text(page, 'profile_user@example.com');
});
test("REQ-6.5: Reject invalid mailbox email", async ({ page }) => {
    await entry(page);
    await login(page, 'profile_user');
    await security(page, 'mailbox');
    await field(page, 'New e-mail:').fill("invalid-email");
    await field(page, 'Confirm your password:').fill("Password123!");
    await button(page, 'Determine').click();
    await text(page, "Invalid email address format.");
    await page.reload();
    await text(page, 'profile_user@example.com');
});
