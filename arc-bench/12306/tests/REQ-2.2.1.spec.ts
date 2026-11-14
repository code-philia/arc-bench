// requirement: REQ-2.2.1
import { expect } from '@playwright/test';
import { test } from './fixtures/test';
import { button, entry, link, loginFields } from './helpers';

test("REQ-2.2.1: Open credential login", async ({ page }) => {
  await entry(page);
  await link(page, 'Login').click();
  await expect(loginFields(page).account).toBeVisible();
  await expect(loginFields(page).password).toBeVisible();
  await expect(button(page, 'LOGIN')).toBeVisible();
});
