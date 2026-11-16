// requirement: REQ-6.4
import { test } from './fixtures/test';
import { button, createAccount, entry, field, home, link, login, security, text } from './helpers';
test("REQ-6.4: Persist changed login password", async ({ page }) => {
    await entry(page);
    const account = await createAccount(page);
    await security(page, 'password');
    await field(page, 'Current password:').fill(account.password);
    await field(page, 'New password:').fill(account.password + 'X');
    await field(page, 'Confirm your password:').fill(account.password + 'X');
    await button(page, 'Determine').click();
    await text(page, 'Password changed successfully.');
    await home(page);
    await link(page, 'Sign Out').click();
    await login(page, account.username, account.password + 'X');
});
test("REQ-6.4: Reject empty password change", async ({ page }) => {
    await entry(page);
    const account = await createAccount(page);
    await security(page, 'password');
    await field(page, 'Current password:').fill("");
    await field(page, 'New password:').fill("");
    await field(page, 'Confirm your password:').fill("");
    await button(page, 'Determine').click();
    await text(page, "Please fill in all password fields.");
    await home(page);
    await link(page, 'Sign Out').click();
    await login(page, account.username, account.password);
});
test("REQ-6.4: Reject incorrect current password", async ({ page }) => {
    await entry(page);
    const account = await createAccount(page);
    await security(page, 'password');
    await field(page, 'Current password:').fill("WrongPassword123!");
    await field(page, 'New password:').fill(account.password + 'X');
    await field(page, 'Confirm your password:').fill(account.password + 'X');
    await button(page, 'Determine').click();
    await text(page, "Incorrect current password.");
    await home(page);
    await link(page, 'Sign Out').click();
    await login(page, account.username, account.password);
});
test("REQ-6.4: Reject mismatched new passwords", async ({ page }) => {
    await entry(page);
    const account = await createAccount(page);
    await security(page, 'password');
    await field(page, 'Current password:').fill(account.password);
    await field(page, 'New password:').fill(account.password + 'X');
    await field(page, 'Confirm your password:').fill(account.password + 'Y');
    await button(page, 'Determine').click();
    await text(page, "New passwords do not match.");
    await home(page);
    await link(page, 'Sign Out').click();
    await login(page, account.username, account.password);
});
