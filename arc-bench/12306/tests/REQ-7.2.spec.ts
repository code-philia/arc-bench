// requirement: REQ-7.2
import { expect } from '@playwright/test';
import { test } from './fixtures/test';
import { entry, button, field, text, row, login, passengerPage, addPassenger, manager } from './helpers';
test("REQ-7.2: Add passenger with durable identity", async ({ page }) => {
    await entry(page);
    await login(page, 'passenger_manager_user');
    await passengerPage(page);
    await addPassenger(page, 'Added Passenger', 'P20269996');
    await text(page, 'Passenger added successfully.');
    await expect(row(page, 'P20269996')).toHaveCount(1);
    await expect(row(page, 'P20269996')).toContainText('Added Passenger');
    await page.reload();
    await expect(row(page, 'P20269996')).toHaveCount(1);
});
test("REQ-7.2: Reject empty passenger form", async ({ page }) => {
    await entry(page);
    await login(page, 'passenger_manager_user');
    await passengerPage(page);
    await button(page, 'Add new passengers').click();
    const d = page.getByRole('dialog', { name: 'Add new passengers', exact: true });
    for (const label of ['Nationality', 'Name', 'Passport number', 'Passport expiration date', 'Date of birth', 'Email address', 'Mobile number', 'Passenger type'])
        await expect(field(d, label)).toBeVisible();
    await expect(d.getByRole('group', { name: 'Gender', exact: true })).toBeVisible();
    await expect(button(d, 'Cancel')).toBeVisible();
    await button(d, 'Determine').click();
    await text(page, 'Please fill in all required fields.');
    await expect(d).toBeVisible();
});
test("REQ-7.2: Reject duplicate passenger passport", async ({ page }) => {
    await entry(page);
    await manager(page);
    await addPassenger(page, "Duplicate Passenger", 'P20269999', {}, false);
    await text(page, "Passport number already exists.");
    await expect(page.getByRole('dialog', { name: 'Add new passengers', exact: true })).toBeVisible();
    await expect(page.getByRole('row').filter({ hasText: "Duplicate Passenger" })).toHaveCount(0);
});
test("REQ-7.2: Reject passenger invalid email", async ({ page }) => {
    await entry(page);
    await manager(page);
    await addPassenger(page, "Invalid Email Passenger", 'P20260013', { "email": "invalid-email" }, false);
    await text(page, "Invalid email address format.");
    await expect(page.getByRole('dialog', { name: 'Add new passengers', exact: true })).toBeVisible();
    await expect(page.getByRole('row').filter({ hasText: "Invalid Email Passenger" })).toHaveCount(0);
});
test("REQ-7.2: Reject passenger invalid mobile", async ({ page }) => {
    await entry(page);
    await manager(page);
    await addPassenger(page, "Invalid Mobile Passenger", 'P20260014', { "mobile": "123" }, false);
    await text(page, "Invalid mobile number format.");
    await expect(page.getByRole('dialog', { name: 'Add new passengers', exact: true })).toBeVisible();
    await expect(page.getByRole('row').filter({ hasText: "Invalid Mobile Passenger" })).toHaveCount(0);
});
