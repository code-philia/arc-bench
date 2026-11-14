// requirement: REQ-7.5.1
import { expect } from '@playwright/test';
import { test } from './fixtures/test';
import { addPassenger, button, entry, manager, passengerKeyword, row } from './helpers';
import { newPassenger } from './fixtures/data';
test("REQ-7.5.1: Search passenger name", async ({ page }) => {
    await entry(page);
    await manager(page);
    const target = newPassenger();
    await addPassenger(page, target);
    const other = newPassenger();
    await addPassenger(page, other);
    await passengerKeyword(page).fill(target.name);
    await button(page, 'Search').click();
    await expect(row(page, target.passport)).toContainText(target.name);
    await expect(row(page, other.passport)).not.toBeVisible();
});
test("REQ-7.5.1: Search passenger ID", async ({ page }) => {
    await entry(page);
    await manager(page);
    const target = newPassenger();
    await addPassenger(page, target);
    const other = newPassenger();
    await addPassenger(page, other);
    await passengerKeyword(page).fill(target.passport);
    await button(page, 'Search').click();
    await expect(row(page, target.passport)).toContainText(target.name);
    await expect(row(page, other.passport)).not.toBeVisible();
});
