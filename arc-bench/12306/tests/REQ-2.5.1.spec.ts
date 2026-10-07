// requirement: REQ-2.5.1
import { expect } from '@playwright/test';
import { test } from './fixtures/test';
import { entry, link } from './helpers';
test("REQ-2.5.1: Read Terms of Service", async ({ page }) => {
    await entry(page);
    await link(page, 'Register').click();
    await expect(link(page, "Terms of Service")).toHaveCount(1);
    await link(page, "Terms of Service").click();
    await expect(page.getByRole('heading', { name: "Terms of Service", exact: true })).toBeVisible();
});
