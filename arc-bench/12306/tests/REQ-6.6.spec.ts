// requirement: REQ-6.6
import { expect } from '@playwright/test';
import { test } from './fixtures/test';
import { button, entry, expectChoice, field, login, section, text } from './helpers';
import { verifiedProfile, newMobile } from './fixtures/data';
const maskedMobile = new RegExp(`\\(\\+86\\).*${verifiedProfile.mobile.slice(0, 3)}\\*{4}${verifiedProfile.mobile.slice(-4)}`);
test("REQ-6.6: Reject empty mobile change", async ({ page }) => {
    await entry(page);
    await login(page, verifiedProfile.username);
    await section(page, 'Personal', 'Verify mobile number');
    await expectChoice(field(page, 'Region code'), '(+86)');
    await expect(page.getByText(maskedMobile)).toBeVisible();
    await field(page, 'New mobile number').fill("");
    await field(page, 'Confirm your password:').fill("");
    await button(page, 'Determine').click();
    await text(page, "Please fill in the new mobile number and password.");
    await expect(page.getByText(maskedMobile)).toBeVisible();
});
test("REQ-6.6: Reject wrong mobile password", async ({ page }) => {
    await entry(page);
    await login(page, verifiedProfile.username);
    await section(page, 'Personal', 'Verify mobile number');
    await expectChoice(field(page, 'Region code'), '(+86)');
    await expect(page.getByText(maskedMobile)).toBeVisible();
    await field(page, 'New mobile number').fill(newMobile());
    await field(page, 'Confirm your password:').fill("WrongPassword123!");
    await button(page, 'Determine').click();
    await text(page, "Incorrect password.");
    await expect(page.getByText(maskedMobile)).toBeVisible();
});
test("REQ-6.6: Reject invalid mobile", async ({ page }) => {
    await entry(page);
    await login(page, verifiedProfile.username);
    await section(page, 'Personal', 'Verify mobile number');
    await expectChoice(field(page, 'Region code'), '(+86)');
    await expect(page.getByText(maskedMobile)).toBeVisible();
    await field(page, 'New mobile number').fill("123");
    await field(page, 'Confirm your password:').fill("Password123!");
    await button(page, 'Determine').click();
    await text(page, "Invalid mobile number format.");
    await expect(page.getByText(maskedMobile)).toBeVisible();
});
