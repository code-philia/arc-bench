// requirement: REQ-6.4
import { expect } from '@playwright/test';
import { test } from './fixtures/test';
import { entry, link, button, field, text, login, home, security, PASS } from './helpers';
test("REQ-6.4: Persist changed login password", async ({ page }) => {
    await entry(page);
    await login(page, 'security_password_change_user');
    await security(page, 'password');
    await field(page, 'Current password:').fill(PASS);
    await field(page, 'New password:').fill(PASS + 'X');
    await field(page, 'Confirm your password:').fill(PASS + 'X');
    await button(page, 'Determine').click();
    await text(page, 'Password changed successfully.');
    await home(page);
    await link(page, 'Sign Out').click();
    await login(page, 'security_password_change_user', PASS + 'X');
});
test("REQ-6.4: Reject empty password change", async ({ page }) => {
    await entry(page);
    await login(page, 'security_password_user');
    await security(page, 'password');
    await field(page, 'Current password:').fill("");
    await field(page, 'New password:').fill("");
    await field(page, 'Confirm your password:').fill("");
    await button(page, 'Determine').click();
    await text(page, "Please fill in all password fields.");
    await home(page);
    await link(page, 'Sign Out').click();
    await login(page, 'security_password_user');
});
test("REQ-6.4: Reject incorrect current password", async ({ page }) => {
    await entry(page);
    await login(page, 'security_password_user');
    await security(page, 'password');
    await field(page, 'Current password:').fill("WrongPassword123!");
    await field(page, 'New password:').fill("Password123!X");
    await field(page, 'Confirm your password:').fill("Password123!X");
    await button(page, 'Determine').click();
    await text(page, "Incorrect current password.");
    await home(page);
    await link(page, 'Sign Out').click();
    await login(page, 'security_password_user');
});
test("REQ-6.4: Reject mismatched new passwords", async ({ page }) => {
    await entry(page);
    await login(page, 'security_password_user');
    await security(page, 'password');
    await field(page, 'Current password:').fill("Password123!");
    await field(page, 'New password:').fill("Password123!X");
    await field(page, 'Confirm your password:').fill("Password123!Mismatch");
    await button(page, 'Determine').click();
    await text(page, "New passwords do not match.");
    await home(page);
    await link(page, 'Sign Out').click();
    await login(page, 'security_password_user');
});
