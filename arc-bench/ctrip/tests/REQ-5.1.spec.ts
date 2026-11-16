// requirement: REQ-5.1
import { expect } from "@playwright/test";
import { test, button, visible, heading, openHome, openPersonal, action, registerAccount } from "./helpers";

test('REQ-5.1: Open personal center', async ({ page }) => {
  await openHome(page);
  await registerAccount(page);
  await button(page, 'My account').click();
  await visible(action(page, 'Personal center'));
  await action(page, 'Personal center').click();
  await heading(page, 'Personal center');
  await visible(button(page, 'Common information'));
});

test('REQ-5.1: Expand and collapse reusable information navigation', async ({ page }) => {
  await openHome(page);
  await registerAccount(page);
  await openPersonal(page);
  const categories = ['Travelers', 'Contacts', 'Invoice titles', 'Addresses'];
  for (const name of categories) await expect(action(page, name)).not.toBeVisible();
  await button(page, 'Common information').click();
  for (const name of categories) await visible(action(page, name));
  await button(page, 'Common information').click();
  for (const name of categories) await expect(action(page, name)).not.toBeVisible();
});
