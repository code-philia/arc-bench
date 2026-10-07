// requirement: REQ-6.6
import { expect } from '@playwright/test';
import { test } from './fixtures/test';
import { entry, button, field, text, login, section } from './helpers';
test("REQ-6.6: Persist updated mobile", async ({ page }) => {
    await entry(page);
    await login(page, 'profile_mobile_update_user');
    await section(page, 'Personal', 'Verify mobile number');
    await expect(field(page, 'Region code').getByRole('option', { name: '(+86)', exact: true, selected: true })).toHaveCount(1);
    await expect(page.getByText(/\(\+86\).*138\*{4}00(?:30|32)/)).toBeVisible();
    await page.getByPlaceholder('new mobile number.', { exact: true }).fill("13800000031");
    await field(page, 'Confirm your password:').fill("Password123!");
    await button(page, 'Determine').click();
    await text(page, "Mobile number updated successfully.");
    await text(page, '13800000031');
    await page.reload();
    await text(page, '13800000031');
});
test("REQ-6.6: Reject empty mobile change", async ({ page }) => {
    await entry(page);
    await login(page, 'profile_user');
    await section(page, 'Personal', 'Verify mobile number');
    await expect(field(page, 'Region code').getByRole('option', { name: '(+86)', exact: true, selected: true })).toHaveCount(1);
    await expect(page.getByText(/\(\+86\).*138\*{4}00(?:30|32)/)).toBeVisible();
    await page.getByPlaceholder('new mobile number.', { exact: true }).fill("");
    await field(page, 'Confirm your password:').fill("");
    await button(page, 'Determine').click();
    await text(page, "Please fill in the new mobile number and password.");
    await expect(page.getByText(/\(\+86\).*138\*{4}0030/)).toBeVisible();
});
test("REQ-6.6: Reject wrong mobile password", async ({ page }) => {
    await entry(page);
    await login(page, 'profile_user');
    await section(page, 'Personal', 'Verify mobile number');
    await expect(field(page, 'Region code').getByRole('option', { name: '(+86)', exact: true, selected: true })).toHaveCount(1);
    await expect(page.getByText(/\(\+86\).*138\*{4}00(?:30|32)/)).toBeVisible();
    await page.getByPlaceholder('new mobile number.', { exact: true }).fill("13800000031");
    await field(page, 'Confirm your password:').fill("WrongPassword123!");
    await button(page, 'Determine').click();
    await text(page, "Incorrect password.");
    await expect(page.getByText(/\(\+86\).*138\*{4}0030/)).toBeVisible();
});
test("REQ-6.6: Reject invalid mobile", async ({ page }) => {
    await entry(page);
    await login(page, 'profile_user');
    await section(page, 'Personal', 'Verify mobile number');
    await expect(field(page, 'Region code').getByRole('option', { name: '(+86)', exact: true, selected: true })).toHaveCount(1);
    await expect(page.getByText(/\(\+86\).*138\*{4}00(?:30|32)/)).toBeVisible();
    await page.getByPlaceholder('new mobile number.', { exact: true }).fill("123");
    await field(page, 'Confirm your password:').fill("Password123!");
    await button(page, 'Determine').click();
    await text(page, "Invalid mobile number format.");
    await expect(page.getByText(/\(\+86\).*138\*{4}0030/)).toBeVisible();
});
