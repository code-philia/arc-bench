// requirement: REQ-2.2.2
import { expect } from '@playwright/test';
import { test } from './fixtures/test';
import { entry, home, link, login, region, statusMessage, text } from './helpers';
import { uniqueInput, verifiedLogin } from './fixtures/data';
test("REQ-2.2.2: Authenticate by username email and mobile", async ({ page }) => {
    await entry(page);
    for (const identity of Object.values(verifiedLogin)) {
        await login(page, identity);
        await expect(statusMessage(page, 'Login successful')).toBeVisible();
        await expect(link(page.getByRole('navigation'), 'Booking')).toBeVisible();
        await home(page);
        await expect(region(page, 'Ticket search')).toBeVisible();
        await expect(link(page, 'My 12306')).toBeVisible();
        await expect(link(page, 'Sign Out')).toBeVisible();
        await page.reload();
        await expect(link(page, 'Sign Out')).toBeVisible();
        await link(page, 'Sign Out').click();
        await expect(link(page, 'Login')).toBeVisible();
        await expect(link(page, 'Sign Out')).not.toBeVisible();
    }
});
test("REQ-2.2.2: Reject empty credentials", async ({ page }) => {
    await entry(page);
    await login(page, "", "", false);
    await text(page, "Please enter your username/email/phone number and password.");
    await expect(link(page, 'Sign Out')).not.toBeVisible();
});
test("REQ-2.2.2: Reject unknown account", async ({ page }) => {
    await entry(page);
    await login(page, `unknown_${uniqueInput()}`, "Password123!", false);
    await text(page, "User not found.");
    await expect(link(page, 'Sign Out')).not.toBeVisible();
});
test("REQ-2.2.2: Reject wrong password", async ({ page }) => {
    await entry(page);
    await login(page, verifiedLogin.username, "WrongPassword123!", false);
    await text(page, "Incorrect password.");
    await expect(link(page, 'Sign Out')).not.toBeVisible();
});
test("REQ-2.2.2: Reject missing password", async ({ page }) => {
    await entry(page);
    await login(page, verifiedLogin.username, "", false);
    await text(page, 'Please enter your username/email/phone number and password.');
    await expect(link(page, 'Sign Out')).not.toBeVisible();
});
test("REQ-2.2.2: Reject missing account", async ({ page }) => {
    await entry(page);
    await login(page, "", "Password123!", false);
    await text(page, 'Please enter your username/email/phone number and password.');
    await expect(link(page, 'Sign Out')).not.toBeVisible();
});
