// requirement: REQ-2.2.3
import { expect } from '@playwright/test';
import { test } from './fixtures/test';
import { entry, field, link, registerEntry, registerSubmit } from './helpers';
test("REQ-2.2.3: Open registration from login", async ({ page }) => {
    await entry(page);
    await link(page, 'Login').click();
    await link(page, registerEntry).click();
    await expect(field(page, 'Nationality')).toBeVisible();
    await expect(field(page, 'Passport number')).toBeVisible();
    await expect(registerSubmit(page)).toBeVisible();
});
