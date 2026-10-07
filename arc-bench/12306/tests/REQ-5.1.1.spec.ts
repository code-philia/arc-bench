// requirement: REQ-5.1.1
import { expect } from '@playwright/test';
import { test } from './fixtures/test';
import { entry, link, button, region, login, center } from './helpers';
test("REQ-5.1.1: Intercept logged-out personal center", async ({ page }) => {
    await entry(page);
    await link(page, 'My 12306').click();
    await expect(page.getByPlaceholder('Email/Username/Mobile number', { exact: true })).toBeVisible();
    await expect(page.getByPlaceholder('Password', { exact: true })).toBeVisible();
    await expect(button(page, 'LOGIN')).toBeVisible();
});
test("REQ-5.1.1: Enter authenticated personal center", async ({ page }) => {
    await entry(page);
    await login(page, 'personal_center_user');
    await center(page);
    for (const name of ['Personal Center', 'Order center', 'Personal', 'Information management'])
        await expect(link(page.getByRole('navigation', { name: 'Personal center menu', exact: true }), name)).toBeVisible();
    await expect(region(page, 'Notice')).toContainText('personal_center_user');
    await expect(region(page, 'Notice').getByRole('img', { name: 'Notice', exact: true })).toBeVisible();
});
