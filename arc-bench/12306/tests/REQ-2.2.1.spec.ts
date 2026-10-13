// requirement: REQ-2.2.1
import { expect } from '@playwright/test';
import { test } from './fixtures/test';
import { entry, link, button, field, region, row, home, login, center, orders, orderSetup, search, booking, confirmation } from './helpers';

test("REQ-2.2.1: Open credential login", async ({ page }) => {
  await entry(page);
  await link(page, 'Login').click();
  await expect(page.getByPlaceholder('Email/Username/Mobile number', { exact: true })).toBeVisible();
  await expect(page.getByPlaceholder('Password', { exact: true })).toBeVisible();
  await expect(button(page, 'LOGIN')).toBeVisible();
});
