// requirement: REQ-2.4
import { expect } from '@playwright/test';
import { test } from './fixtures/test';
import { entry, button, field, text, login, home, recover, PASS } from './helpers';
test("REQ-2.4: Reset password and authenticate", async ({ page }) => {
    await entry(page);
    await recover(page, 'reset_user@example.com', 'P20260011');
    await field(page, 'New password:').fill(PASS + 'X');
    await field(page, 'Confirm new password:').fill(PASS + 'X');
    await button(page, 'submit').click();
    await text(page, 'Password reset successful.');
    await home(page);
    await login(page, 'reset_user', PASS + 'X');
});
test("REQ-2.4: Reject missing identity", async ({ page }) => {
    await entry(page);
    await recover(page, "", "", false);
    await text(page, "Please enter your email and ID number.");
    await expect(field(page, 'New password:')).not.toBeVisible();
});
test("REQ-2.4: Reject mismatched identity", async ({ page }) => {
    await entry(page);
    await recover(page, "wrong@example.com", "P20260011", false);
    await text(page, "Email address and ID number do not match.");
    await expect(field(page, 'New password:')).not.toBeVisible();
});
test("REQ-2.4: Reject new password mismatch", async ({ page }) => {
    await entry(page);
    await recover(page, 'reset_mismatch_user@example.com', 'P20260012');
    await field(page, 'New password:').fill(PASS + 'X');
    await field(page, 'Confirm new password:').fill(PASS + 'Y');
    await button(page, 'submit').click();
    await text(page, 'Passwords do not match.');
    await expect(field(page, 'New password:')).toBeVisible();
    await home(page);
    await login(page, 'reset_mismatch_user');
});
test("REQ-2.4: Reject missing recovery email", async ({ page }) => {
    await entry(page);
    await recover(page, "", "P20260011", false);
    await text(page, 'Please enter your email and ID number.');
    await expect(field(page, 'New password:')).not.toBeVisible();
    await expect(field(page, 'Email:')).toBeVisible();
});
test("REQ-2.4: Reject missing recovery ID", async ({ page }) => {
    await entry(page);
    await recover(page, "reset_user@example.com", "", false);
    await text(page, 'Please enter your email and ID number.');
    await expect(field(page, 'New password:')).not.toBeVisible();
    await expect(field(page, 'Email:')).toBeVisible();
});
