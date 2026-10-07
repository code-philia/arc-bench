// requirement: REQ-7.4
import { expect } from '@playwright/test';
import { test } from './fixtures/test';
import { entry, button, text, row, login, passengerPage, addPassenger } from './helpers';
test("REQ-7.4: Confirm selected batch deletion", async ({ page }) => {
    await entry(page);
    await login(page, 'passenger_manager_user');
    await passengerPage(page);
    await addPassenger(page, 'Batch Passenger One', 'P20269983');
    await addPassenger(page, 'Batch Passenger Two', 'P20269984');
    await addPassenger(page, 'Unselected Passenger', 'P20269987');
    await page.getByRole('checkbox', { name: 'Select P20269983', exact: true }).check();
    await page.getByRole('checkbox', { name: 'Select P20269984', exact: true }).check();
    await button(page, 'Batch deletion').click();
    const d = page.getByRole('dialog', { name: 'Are you sure you want to delete the selected passengers?', exact: true });
    await expect(d).toBeVisible();
    await button(d, 'Confirm').click();
    await expect(d).not.toBeVisible();
    await text(page, 'Passengers deleted successfully.');
    await expect(row(page, 'P20269983')).toHaveCount(0);
    await expect(row(page, 'P20269984')).toHaveCount(0);
    await expect(row(page, 'passenger_manager_user')).toBeVisible();
    await expect(row(page, 'P20269987')).toBeVisible();
});
test("REQ-7.4: Dismiss selected batch deletion", async ({ page }) => {
    await entry(page);
    await login(page, 'passenger_manager_user');
    await passengerPage(page);
    await addPassenger(page, 'Batch Cancel Passenger One', 'P20269985');
    await addPassenger(page, 'Batch Cancel Passenger Two', 'P20269986');
    await addPassenger(page, 'Unselected Passenger', 'P20269987');
    await page.getByRole('checkbox', { name: 'Select P20269985', exact: true }).check();
    await page.getByRole('checkbox', { name: 'Select P20269986', exact: true }).check();
    await button(page, 'Batch deletion').click();
    const d = page.getByRole('dialog', { name: 'Are you sure you want to delete the selected passengers?', exact: true });
    await expect(d).toBeVisible();
    await button(d, 'Cancel').click();
    await expect(d).not.toBeVisible();
    await expect(row(page, 'P20269985')).toBeVisible();
    await expect(row(page, 'P20269986')).toBeVisible();
    await expect(row(page, 'passenger_manager_user')).toBeVisible();
    await expect(row(page, 'P20269987')).toBeVisible();
});
test("REQ-7.4: Select all protects holder", async ({ page }) => {
    await entry(page);
    await login(page, 'passenger_manager_user');
    await passengerPage(page);
    await addPassenger(page, 'Batch Passenger One', 'P20269983');
    await addPassenger(page, 'Batch Passenger Two', 'P20269984');
    await page.getByRole('checkbox', { name: 'All', exact: true }).check();
    await button(page, 'Batch deletion').click();
    const d = page.getByRole('dialog', { name: 'Are you sure you want to delete the selected passengers?', exact: true });
    await expect(d).toBeVisible();
    await button(d, 'Confirm').click();
    await expect(d).not.toBeVisible();
    await text(page, 'Passengers deleted successfully.');
    await expect(row(page, 'P20269983')).toHaveCount(0);
    await expect(row(page, 'P20269984')).toHaveCount(0);
    await expect(row(page, 'passenger_manager_user')).toBeVisible();
});
test("REQ-7.4: Persist confirmed batch deletion", async ({ page }) => {
    await entry(page);
    await login(page, 'passenger_manager_user');
    await passengerPage(page);
    await addPassenger(page, 'Batch Passenger One', 'P20269983');
    await addPassenger(page, 'Batch Passenger Two', 'P20269984');
    await addPassenger(page, 'Unselected Passenger', 'P20269987');
    for (const passport of ['P20269983', 'P20269984'])
        await page.getByRole('checkbox', { name: `Select ${passport}`, exact: true }).check();
    await button(page, 'Batch deletion').click();
    await button(page.getByRole('dialog', { name: 'Are you sure you want to delete the selected passengers?', exact: true }), 'Confirm').click();
    await text(page, 'Passengers deleted successfully.');
    await page.reload();
    for (const passport of ['P20269983', 'P20269984'])
        await expect(row(page, passport)).toHaveCount(0);
    await expect(row(page, 'passenger_manager_user')).toBeVisible();
    await expect(row(page, 'P20269987')).toBeVisible();
});
