// requirement: REQ-2.1.3
import { expect } from '@playwright/test';
import { test } from './fixtures/test';
import { entry, field, link, register, registerSubmit, signOutIfSignedIn, text } from './helpers';
import { newAccount } from './fixtures/data';
test("REQ-2.1.3: Reject missing fields", async ({ page }) => {
    await entry(page);
    await link(page, 'Register').click();
    await registerSubmit(page).click();
    await text(page, 'Please fill in all required fields.');
    await expect(field(page, 'Username')).toBeVisible();
    await expect(page.getByText('Registration successful.', { exact: true })).not.toBeVisible();
});
test("REQ-2.1.3: Reject duplicate passport", async ({ page }) => {
    await entry(page);
    const existing = newAccount();
    await register(page, existing);
    await text(page, 'Registration successful.');
    await signOutIfSignedIn(page);
    await register(page, { ...newAccount(), passport: existing.passport });
    await text(page, "Passport number already exists.");
    await expect(field(page, 'Username')).toBeVisible();
    await expect(page.getByText('Registration successful.', { exact: true })).not.toBeVisible();
});
test("REQ-2.1.3: Reject duplicate username", async ({ page }) => {
    await entry(page);
    const existing = newAccount();
    await register(page, existing);
    await text(page, 'Registration successful.');
    await signOutIfSignedIn(page);
    await register(page, { ...newAccount(), username: existing.username });
    await text(page, "Username already exists.");
    await expect(field(page, 'Username')).toBeVisible();
    await expect(page.getByText('Registration successful.', { exact: true })).not.toBeVisible();
});
test("REQ-2.1.3: Reject password mismatch", async ({ page }) => {
    await entry(page);
    const account = newAccount();
    await register(page, { ...account, confirm: account.password + "X" });
    await text(page, "Passwords do not match.");
    await expect(field(page, 'Username')).toBeVisible();
    await expect(page.getByText('Registration successful.', { exact: true })).not.toBeVisible();
});
test("REQ-2.1.3: Reject invalid email", async ({ page }) => {
    await entry(page);
    await register(page, { ...newAccount(), email: "invalid-email" });
    await text(page, "Invalid email address format.");
    await expect(field(page, 'Username')).toBeVisible();
    await expect(page.getByText('Registration successful.', { exact: true })).not.toBeVisible();
});
test("REQ-2.1.3: Require agreement acceptance", async ({ page }) => {
    await entry(page);
    await register(page, { ...newAccount(), agree: false });
    await text(page, "Please agree to the Terms of Service and Privacy Policy.");
    await expect(field(page, 'Username')).toBeVisible();
    await expect(page.getByText('Registration successful.', { exact: true })).not.toBeVisible();
});
test("REQ-2.1.3: Reject missing confirmation password", async ({ page }) => {
    await entry(page);
    await register(page, { ...newAccount(), confirm: '' });
    await text(page, 'Please fill in all required fields.');
    await expect(field(page, 'Confirm Password')).toBeVisible();
    await expect(page.getByText('Registration successful.', { exact: true })).not.toBeVisible();
});
