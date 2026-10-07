// requirement: REQ-8.1.1
import { expect } from '@playwright/test';
import { test } from './fixtures/test';
import { entry, button, row, login, search, booking } from './helpers';
test("REQ-8.1.1: Require quick login before booking", async ({ page }) => {
    await entry(page);
    await search(page);
    await button(row(page, 'G1001'), 'Book').click();
    const d = page.getByRole('dialog', { name: 'Login', exact: true });
    await expect(d.getByRole('img', { name: 'Login', exact: true })).toBeVisible();
    await expect(d.getByRole('heading', { name: 'Login', exact: true })).toBeVisible();
    await expect(d.getByPlaceholder('Email/Username/Mobile number', { exact: true })).toBeVisible();
    await expect(d.getByPlaceholder('Password', { exact: true })).toBeVisible();
    await expect(button(d, 'LOGIN')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Train Information:', exact: true })).not.toBeVisible();
});
