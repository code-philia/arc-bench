// requirement: REQ-8.1.2
import { expect } from '@playwright/test';
import { test } from './fixtures/test';
import { entry, link, button, field, row, login, search } from './helpers';
test("REQ-8.1.2: Open recovery from quick login", async ({ page }) => {
    await entry(page);
    await search(page);
    await button(row(page, 'G1001'), 'Book').click();
    await link(page.getByRole('dialog', { name: 'Login', exact: true }), "Forgot your password").click();
    await expect(field(page, 'Email:')).toBeVisible();
    await expect(field(page, 'ID number:')).toBeVisible();
    await expect(button(page, 'submit')).toBeVisible();
});
