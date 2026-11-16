// requirement: REQ-2.5.2
import { expect } from '@playwright/test';
import { test } from './fixtures/test';
import { entry, heading, link, openAgreement } from './helpers';
test("REQ-2.5.2: Read Terms of Service", async ({ page }) => {
    await entry(page);
    await link(page, 'Register').click();
    await openAgreement(page, "Terms of Service");
    await expect(heading(page, "Terms of Service")).toBeVisible();
});
