// requirement: REQ-1.1
import { test, expect } from "@playwright/test";
import { field, nav, visible, heading, openHome, installClock } from "./helpers";

test.beforeEach(async ({ page }) => { await installClock(page); });

test('REQ-1.1: Show signed-out entry', async ({ page }, testInfo) => {
  await openHome(page);
  await expect(page.getByRole('heading', { name: 'Ctrip Travel', exact: true })).toHaveCount(1);
  await heading(page, 'Ctrip Travel');
  await expect(nav(page).getByRole('link', { name: 'Log in', exact: true })).toHaveCount(1);
  await expect(nav(page).getByRole('link', { name: 'Register', exact: true })).toHaveCount(1);
  await visible(nav(page).getByRole('link', { name: 'Log in', exact: true }));
  await visible(nav(page).getByRole('link', { name: 'Register', exact: true }));
  await visible(page.getByRole('searchbox'));
  await visible(field(page, 'Origin'));
  await visible(field(page, 'Destination'));
});

