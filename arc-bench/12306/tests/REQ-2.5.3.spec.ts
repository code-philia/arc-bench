// requirement: REQ-2.5.3
import { expect } from '@playwright/test';
import { test } from './fixtures/test';
import { entry, heading, link, openAgreement } from './helpers';
test("REQ-2.5.3: Read Privacy Policy", async ({ page }) => {
    await entry(page);
    await link(page, 'Register').click();
    await openAgreement(page, "Privacy Policy");
    await expect(heading(page, "Privacy Policy")).toBeVisible();
});
