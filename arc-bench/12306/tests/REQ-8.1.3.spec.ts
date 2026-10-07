// requirement: REQ-8.1.3
import { expect } from '@playwright/test';
import { test } from './fixtures/test';
import { entry, link, button, field, row, login, search } from './helpers';
test("REQ-8.1.3: Open registration from quick login", async ({ page }) => {
    await entry(page);
    await search(page);
    await button(row(page, 'G1001'), 'Book').click();
    await link(page.getByRole('dialog', { name: 'Login', exact: true }), "No account yet? Register now.").click();
    for (const label of ['Username', 'Password', 'Confirm Password'])
        await expect(field(page, label)).toBeVisible();
    await expect(button(page, 'Register')).toBeVisible();
});
