// requirement: REQ-2.4
import { expect, type Page } from '@playwright/test';
import { test } from './fixtures/test';
import { button, entry, field, home, login, recover, register, signOutIfSignedIn, text } from './helpers';
import { newAccount, newEmail } from './fixtures/data';

async function registerForRecovery(page: Page) {
    const account = newAccount();
    await register(page, account);
    await text(page, 'Registration successful.');
    await signOutIfSignedIn(page);
    return account;
}

test("REQ-2.4: Reject missing identity", async ({ page }) => {
    await entry(page);
    await recover(page, "", "", false);
    await text(page, "Please enter your email and ID number.");
    await expect(field(page, 'New password:')).not.toBeVisible();
});
test("REQ-2.4: Reject mismatched identity", async ({ page }) => {
    await entry(page);
    const account = await registerForRecovery(page);
    await recover(page, newEmail(), account.passport, false);
    await text(page, "Email address and ID number do not match.");
    await expect(field(page, 'New password:')).not.toBeVisible();
});
test("REQ-2.4: Reject new password mismatch", async ({ page }) => {
    await entry(page);
    const account = await registerForRecovery(page);
    await recover(page, account.email, account.passport);
    await field(page, 'New password:').fill(account.password + 'X');
    await field(page, 'Confirm new password:').fill(account.password + 'Y');
    await button(page, 'submit').click();
    await text(page, 'Passwords do not match.');
    await expect(field(page, 'New password:')).toBeVisible();
    await home(page);
    await login(page, account.username, account.password);
});
test("REQ-2.4: Reject missing recovery email", async ({ page }) => {
    await entry(page);
    const account = await registerForRecovery(page);
    await recover(page, "", account.passport, false);
    await text(page, 'Please enter your email and ID number.');
    await expect(field(page, 'New password:')).not.toBeVisible();
    await expect(field(page, 'Email:')).toBeVisible();
});
test("REQ-2.4: Reject missing recovery ID", async ({ page }) => {
    await entry(page);
    const account = await registerForRecovery(page);
    await recover(page, account.email, "", false);
    await text(page, 'Please enter your email and ID number.');
    await expect(field(page, 'New password:')).not.toBeVisible();
    await expect(field(page, 'Email:')).toBeVisible();
});
