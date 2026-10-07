// requirement: REQ-2.1.2
import { expect } from '@playwright/test';
import { test } from './fixtures/test';
import { entry, link, button, field, text, register, home, confirmation } from './helpers';
test("REQ-2.1.2: Reject missing fields", async ({ page }) => {
    await entry(page);
    await link(page, 'Register').click();
    await button(page, 'Register').click();
    await text(page, 'Please fill in all required fields.');
    await expect(field(page, 'Username')).toBeVisible();
    await expect(page.getByText('Registration successful.', { exact: true })).not.toBeVisible();
});
test("REQ-2.1.2: Reject duplicate passport", async ({ page }) => {
    await entry(page);
    await register(page, { passport: 'P20260002', username: 'existing_passport' });
    await home(page);
    if (await link(page, 'Sign Out').isVisible())
        await link(page, 'Sign Out').click();
    await register(page, { "passport": "P20260002", "username": "duplicate_passport_user" });
    await text(page, "Passport number already exists.");
    await expect(field(page, 'Username')).toBeVisible();
    await expect(page.getByText('Registration successful.', { exact: true })).not.toBeVisible();
});
test("REQ-2.1.2: Reject duplicate username", async ({ page }) => {
    await entry(page);
    await register(page, { passport: 'P20260104', username: 'username_taken' });
    await home(page);
    if (await link(page, 'Sign Out').isVisible())
        await link(page, 'Sign Out').click();
    await register(page, { "passport": "P20260004", "username": "username_taken" });
    await text(page, "Username already exists.");
    await expect(field(page, 'Username')).toBeVisible();
    await expect(page.getByText('Registration successful.', { exact: true })).not.toBeVisible();
});
test("REQ-2.1.2: Reject password mismatch", async ({ page }) => {
    await entry(page);
    await register(page, { "passport": "P20260007", "username": "traveler_mismatch", "confirm": "Password123!Mismatch" });
    await text(page, "Passwords do not match.");
    await expect(field(page, 'Username')).toBeVisible();
    await expect(page.getByText('Registration successful.', { exact: true })).not.toBeVisible();
});
test("REQ-2.1.2: Reject invalid email", async ({ page }) => {
    await entry(page);
    await register(page, { "passport": "P20260008", "username": "traveler_invalid_email", "email": "invalid-email" });
    await text(page, "Invalid email address format.");
    await expect(field(page, 'Username')).toBeVisible();
    await expect(page.getByText('Registration successful.', { exact: true })).not.toBeVisible();
});
test("REQ-2.1.2: Require agreement acceptance", async ({ page }) => {
    await entry(page);
    await register(page, { "passport": "P20260009", "username": "traveler_agreement", "agree": false });
    await text(page, "Please agree to the Terms of Service and Privacy Policy.");
    await expect(field(page, 'Username')).toBeVisible();
    await expect(page.getByText('Registration successful.', { exact: true })).not.toBeVisible();
});
test("REQ-2.1.2: Reject missing confirmation password", async ({ page }) => {
    await entry(page);
    await register(page, { username: 'traveler_missing_confirm', passport: 'P20260015', confirm: '' });
    await text(page, 'Please fill in all required fields.');
    await expect(field(page, 'Confirm Password')).toBeVisible();
    await expect(page.getByText('Registration successful.', { exact: true })).not.toBeVisible();
});
