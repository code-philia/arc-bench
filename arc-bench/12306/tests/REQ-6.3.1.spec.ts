// requirement: REQ-6.3.1
import { expect } from '@playwright/test';
import { test } from './fixtures/test';
import { button, createAccount, entry, field, region, section } from './helpers';
import { newEmail } from './fixtures/data';
test("REQ-6.3.1: Save contact email", async ({ page }) => {
    await entry(page);
    await createAccount(page);
    await section(page, 'Personal', 'User information');
    const r = region(page, 'Contact information');
    await button(r, 'Edit').click();
    const email = newEmail();
    await field(r, 'Email').fill(email);
    await button(r, 'Save').click();
    await expect(r).toContainText(email);
    await expect(button(r, 'Edit')).toBeVisible();
    await page.reload();
    await expect(r).toContainText(email);
});
