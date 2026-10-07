// requirement: REQ-2.5.2
import { expect } from '@playwright/test';
import { test } from './fixtures/test';
import { entry, link } from './helpers';
test("REQ-2.5.2: Read Privacy Policy", async ({ page }) => {
    await entry(page);
    await link(page, 'Register').click();
    await expect(link(page, "Privacy Policy")).toHaveCount(1);
    await link(page, "Privacy Policy").click();
    await expect(page.getByRole('heading', { name: "Privacy Policy", exact: true })).toBeVisible();
});
