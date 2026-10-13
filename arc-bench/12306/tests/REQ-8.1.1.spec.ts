// requirement: REQ-8.1.1
import { expect } from '@playwright/test';
import { test } from './fixtures/test';
import { entry, link, button, field, region, row, home, login, center, orders, orderSetup, search, booking, confirmation } from './helpers';

test("REQ-8.1.1: Open booking quick-login entry", async ({ page }) => {
  await entry(page);
  await search(page);
  await button(row(page, 'G1001'), 'Book').click();
  const dialog = page.getByRole('dialog', { name: 'Login', exact: true });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByPlaceholder('Email/Username/Mobile number', { exact: true })).toBeVisible();
  await expect(dialog.getByPlaceholder('Password', { exact: true })).toBeVisible();
  await expect(button(dialog, 'LOGIN')).toBeVisible();
});
