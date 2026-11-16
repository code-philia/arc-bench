// requirement: REQ-6.5
import { test } from './fixtures/test';
import { button, createAccount, entry, field, security, text } from './helpers';
import { newEmail } from './fixtures/data';
test("REQ-6.5: Persist security email", async ({ page }) => {
    await entry(page);
    const account = await createAccount(page);
    const email = newEmail();
    await security(page, 'mailbox');
    await field(page, 'New e-mail:').fill(email);
    await field(page, 'Confirm your password:').fill(account.password);
    await button(page, 'Determine').click();
    await text(page, "Security mailbox updated successfully.");
    await text(page, email);
    await page.reload();
    await text(page, email);
});
test("REQ-6.5: Reject empty mailbox change", async ({ page }) => {
    await entry(page);
    const account = await createAccount(page);
    await security(page, 'mailbox');
    await field(page, 'New e-mail:').fill("");
    await field(page, 'Confirm your password:').fill("");
    await button(page, 'Determine').click();
    await text(page, "Please fill in the new email and password.");
    await page.reload();
    await text(page, account.email);
});
test("REQ-6.5: Reject wrong mailbox password", async ({ page }) => {
    await entry(page);
    const account = await createAccount(page);
    await security(page, 'mailbox');
    await field(page, 'New e-mail:').fill(newEmail());
    await field(page, 'Confirm your password:').fill("WrongPassword123!");
    await button(page, 'Determine').click();
    await text(page, "Incorrect password.");
    await page.reload();
    await text(page, account.email);
});
test("REQ-6.5: Reject invalid mailbox email", async ({ page }) => {
    await entry(page);
    const account = await createAccount(page);
    await security(page, 'mailbox');
    await field(page, 'New e-mail:').fill("invalid-email");
    await field(page, 'Confirm your password:').fill(account.password);
    await button(page, 'Determine').click();
    await text(page, "Invalid email address format.");
    await page.reload();
    await text(page, account.email);
});
