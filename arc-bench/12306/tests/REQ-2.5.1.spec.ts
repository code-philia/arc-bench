// requirement: REQ-2.5.1
import { expect } from '@playwright/test';
import { test } from './fixtures/test';
import { openAgreement, entry, link, button, field, region, row, home, login, center, orders, orderSetup, search, booking, confirmation } from './helpers';

test("REQ-2.5.1: Open registration agreement pages", async ({ page }) => {
  for (const name of ['Terms of Service', 'Privacy Policy']) {
    await entry(page);
    await link(page, 'Register').click();
    await openAgreement(page, name);
    await expect(page.getByRole('heading', { name, exact: true })).toBeVisible();
  }
});
