// requirement: REQ-2.1
import { test } from '@playwright/test';
import { enter, go, loginSubmit, textField, toggle } from './helpers';

test("REQ-2.1: Show login form", async ({ page }) => {
  await enter(page);
  await go(page, 'Login');
  await textField(page, 'Email').expectVisible();
  await textField(page, 'Password').expectVisible();
  await loginSubmit(page).expectVisible();
  await toggle(page, 'Remember Me').expectState(false);
});
