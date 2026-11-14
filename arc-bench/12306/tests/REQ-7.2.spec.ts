// requirement: REQ-7.2
import { expect } from '@playwright/test';
import { test } from './fixtures/test';
import { addPassenger, button, entry, field, manager, passengerForm, row, text } from './helpers';
import { newPassenger } from './fixtures/data';
test("REQ-7.2: Add passenger with durable identity", async ({ page }) => {
    await entry(page);
    await manager(page);
    const passenger = newPassenger();
    await addPassenger(page, passenger);
    await text(page, 'Passenger added successfully.');
    await expect(row(page, passenger.passport)).toHaveCount(1);
    await expect(row(page, passenger.passport)).toContainText(passenger.name);
    await page.reload();
    await expect(row(page, passenger.passport)).toHaveCount(1);
    await expect(row(page, passenger.passport)).toContainText(passenger.name);
});
test("REQ-7.2: Reject empty passenger form", async ({ page }) => {
    await entry(page);
    await manager(page);
    await button(page, 'Add new passengers').click();
    const d = passengerForm(page);
    for (const label of ['Nationality', 'Name', 'Passport number', 'Passport expiration date', 'Date of birth', 'Email address', 'Mobile number', 'Passenger type'])
        await expect(field(d, label)).toBeVisible();
    await expect(d.getByRole('group', { name: 'Gender', exact: true })).toBeVisible();
    await expect(button(d, 'Cancel')).toBeVisible();
    await button(d, /^(Determine|Confirm)$/).click();
    await text(page, 'Please fill in all required fields.');
    await expect(d).toBeVisible();
});
test("REQ-7.2: Reject duplicate passenger passport", async ({ page }) => {
    await entry(page);
    await manager(page);
    const existing = newPassenger();
    await addPassenger(page, existing);
    const duplicate = { ...newPassenger(), passport: existing.passport };
    await addPassenger(page, duplicate, false);
    await text(page, "Passport number already exists.");
    await expect(passengerForm(page)).toBeVisible();
    await expect(row(page, duplicate.name)).toHaveCount(0);
    await expect(row(page, existing.passport)).toContainText(existing.name);
});
test("REQ-7.2: Reject passenger invalid email", async ({ page }) => {
    await entry(page);
    await manager(page);
    const invalid = { ...newPassenger(), email: 'invalid-email' };
    await addPassenger(page, invalid, false);
    await text(page, "Invalid email address format.");
    await expect(passengerForm(page)).toBeVisible();
    await expect(row(page, invalid.name)).toHaveCount(0);
});
