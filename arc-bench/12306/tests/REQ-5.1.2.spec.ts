// requirement: REQ-5.1.2
import { expect } from '@playwright/test';
import { test } from './fixtures/test';
import { button, center, centerMenu, createAccount, entry, link, loginFields, region } from './helpers';
test("REQ-5.1.2: Intercept logged-out personal center", async ({ page }) => {
    await entry(page);
    await link(page, 'My 12306').click();
    await expect(loginFields(page).account).toBeVisible();
    await expect(loginFields(page).password).toBeVisible();
    await expect(button(page, 'LOGIN')).toBeVisible();
});
test("REQ-5.1.2: Enter authenticated personal center", async ({ page }) => {
    await entry(page);
    const account = await createAccount(page);
    await center(page);
    for (const name of ['Personal Center', 'Order center', 'Personal', 'Information management'])
        await expect(link(centerMenu(page), name)).toBeVisible();
    await expect(region(page, 'Notice')).toContainText(account.username);
    await expect(region(page, 'Notice').getByRole('img', { name: 'Notice', exact: true })).toBeVisible();
});
