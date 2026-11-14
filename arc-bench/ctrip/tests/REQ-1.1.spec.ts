// requirement: REQ-1.1
import { expect } from "@playwright/test";
import { test, field, nav, visible, heading, openHome, action, searchBox } from "./helpers";

test('REQ-1.1: Show signed-out entry', async ({ page }) => {
  await openHome(page);
  await expect(page.getByRole('heading', { name: 'Ctrip Travel', exact: true })).toHaveCount(1);
  await heading(page, 'Ctrip Travel');
  await expect(action(nav(page), 'Log in')).toHaveCount(1);
  await expect(action(nav(page), 'Register')).toHaveCount(1);
  await visible(action(nav(page), 'Log in'));
  await visible(action(nav(page), 'Register'));
  await visible(searchBox(page));
  await visible(field(page, 'Origin'));
  await visible(field(page, 'Destination'));
});
