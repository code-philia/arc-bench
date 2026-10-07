// requirement: REQ-5.1
import { test, expect } from "@playwright/test";
import { button, visible, heading, openHome, installClock, loginOwner, openPersonal } from "./helpers";

test.beforeEach(async ({ page }) => { await installClock(page); });

test('REQ-5.1: Open personal center', async ({ page }, testInfo) => {
  await openHome(page);
  await loginOwner(page, 'personal_read');
  await button(page, 'My account').click();
  await visible(page.getByRole('menu').filter({ has: page.getByRole('link', { name: 'Personal center', exact: true }) }));
  await page.getByRole('link', { name: 'Personal center', exact: true }).click();
  await heading(page, 'Personal center');
  await visible(button(page, 'Common information'));
});

test('REQ-5.1: Expand and collapse reusable information navigation', async ({ page }, testInfo) => {
  await openHome(page);
  await openPersonal(page, 'personal_read');
  await button(page, 'Common information').click();
  for (const name of ['Travelers', 'Contacts', 'Invoice titles', 'Addresses']) await visible(page.getByRole('link', { name, exact: true }));
  await button(page, 'Common information').click();
  for (const name of ['Travelers', 'Contacts', 'Invoice titles', 'Addresses']) await expect(page.getByRole('link', { name, exact: true })).not.toBeVisible();
});

