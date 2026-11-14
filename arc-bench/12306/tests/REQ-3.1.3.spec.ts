// requirement: REQ-3.1.3
import { expect } from '@playwright/test';
import { test, travelDate } from './fixtures/test';
import { button, chooseDepartureDate, entry, field, region, text } from './helpers';
test("REQ-3.1.3: Select departure date", async ({ page }) => {
    await entry(page);
    await chooseDepartureDate(page, travelDate(page));
    await expect(field(page, 'Date')).toHaveValue(travelDate(page));
});
test("REQ-3.1.3: Reject past date", async ({ page }) => {
    await entry(page);
    await field(page, 'Date').fill(travelDate(page, -1));
    await button(page, 'Search').click();
    await text(page, `Please choose a departure date from ${travelDate(page)} through ${travelDate(page, 14)}.`);
    await expect(region(page, 'Ticket search')).toBeVisible();
});
test("REQ-3.1.3: Reject date beyond sale window", async ({ page }) => {
    await entry(page);
    await field(page, 'Date').fill(travelDate(page, 15));
    await button(page, 'Search').click();
    await text(page, `Please choose a departure date from ${travelDate(page)} through ${travelDate(page, 14)}.`);
    await expect(region(page, 'Ticket search')).toBeVisible();
});
