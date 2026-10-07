// requirement: REQ-7.3.2
import { expect } from '@playwright/test';
import { test } from './fixtures/test';
import { entry, button, row, login, passengerPage, addPassenger } from './helpers';
test("REQ-7.3.2: Dismiss passenger deletion", async ({ page }) => {
    await entry(page);
    await login(page, 'passenger_manager_user');
    await passengerPage(page);
    await addPassenger(page, 'Cancel Passenger', 'P20269982');
    await button(row(page, 'P20269982'), 'Delete').click();
    const d = page.getByRole('dialog', { name: 'Are you sure you want to delete this passenger?', exact: true });
    await expect(d).toBeVisible();
    await button(d, 'Cancel').click();
    await expect(d).not.toBeVisible();
    await expect(row(page, 'P20269982')).toBeVisible();
    await page.reload();
    await expect(row(page, 'P20269982')).toBeVisible();
});
