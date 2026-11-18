// requirement: REQ-7.2
import { expect } from '@playwright/test';
import { test } from './fixtures/test';
import { addPassenger, addPassengerEntry, button, entry, expectMaskedPassenger, field, link, manager, passengerForm, passengerRow, text } from './helpers';
import { newPassenger } from './fixtures/data';
test("REQ-7.2: Add passenger with durable identity", async ({ page }) => {
    await entry(page);
    await manager(page);
    const passenger = newPassenger();
    await addPassenger(page, passenger);
    await expectMaskedPassenger(page, passenger);
    await page.reload();
    await expectMaskedPassenger(page, passenger);
});
test("REQ-7.2: Reject empty passenger form", async ({ page }) => {
    await entry(page);
    await manager(page);
    await addPassengerEntry(page).click();
    const d = passengerForm(page);
    for (const label of ['Nationality', 'Name', 'Passport number', 'Passport expiration date', 'Date of birth', 'Email address', 'Mobile number', 'Passenger type'])
        await expect(field(d, label)).toBeVisible();
    for (const gender of ['Male', 'Female'])
        await expect(d.getByRole('radio', { name: gender, exact: true })).toBeVisible();
    await expect(link(d, 'Cancel')).toBeVisible();
    await button(d, 'Confirm').click();
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
    await link(passengerForm(page), 'Cancel').click();
    await expect(addPassengerEntry(page)).toBeVisible();
    await expect(passengerRow(page, duplicate.name)).toHaveCount(0);
    await expectMaskedPassenger(page, existing);
});
test("REQ-7.2: Reject passenger invalid email", async ({ page }) => {
    await entry(page);
    await manager(page);
    const invalid = { ...newPassenger(), email: 'invalid-email' };
    await addPassenger(page, invalid, false);
    await text(page, "Invalid email address format.");
    await expect(passengerForm(page)).toBeVisible();
    await expect(passengerRow(page, invalid.name)).toHaveCount(0);
});
