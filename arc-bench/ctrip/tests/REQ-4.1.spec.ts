// requirement: REQ-4.1
import { test, expect } from "@playwright/test";
import { button, region, visible, heading, openHome, installClock, loginOwner } from "./helpers";

test.beforeEach(async ({ page }) => { await installClock(page); });

test('REQ-4.1: Open orders from account menu', async ({ page }, testInfo) => {
  await openHome(page);
  await loginOwner(page, 'order_read');
  await button(page, 'My account').click();
  await visible(page.getByRole('menu').filter({ has: page.getByRole('link', { name: 'Orders', exact: true }) }));
  await page.getByRole('link', { name: 'Orders', exact: true }).click();
  await heading(page, 'Orders');
  await visible(region(page, 'Order list'));
});

