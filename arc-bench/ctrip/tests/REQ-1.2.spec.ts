// requirement: REQ-1.2
import { test, expect } from "@playwright/test";
import { field, action, visible, heading, openHome, installClock, openLogin, login } from "./helpers";

test.beforeEach(async ({ page }) => { await installClock(page); });

test('REQ-1.2: Open password login', async ({ page }, testInfo) => {
  await openHome(page);
  await openLogin(page);
  await heading(page, 'Log in');
  await visible(field(page, 'Account'));
  await visible(field(page, 'Password'));
});

test('REQ-1.2: Switch login modes', async ({ page }, testInfo) => {
  await openHome(page);
  await openLogin(page);
  await action(page, 'Verification code login').click();
  await visible(field(page, 'Mobile number'));
  await visible(field(page, 'Verification code'));
  await action(page, 'Password login').click();
  await visible(field(page, 'Account'));
  await visible(field(page, 'Password'));
});

