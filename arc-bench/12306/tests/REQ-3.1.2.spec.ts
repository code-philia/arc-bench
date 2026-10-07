// requirement: REQ-3.1.2
import { expect } from '@playwright/test';
import { test } from './fixtures/test';
import { entry, button, field, text, region, search } from './helpers';
test("REQ-3.1.2: Select departure date", async ({ page }) => {
    await entry(page);
    await field(page, 'Date').click();
    await button(page, '2026-07-21').click();
    await expect(field(page, 'Date')).toHaveValue('2026-07-21');
});
test("REQ-3.1.2: Reject past date", async ({ page }) => {
    await entry(page);
    await field(page, 'Date').fill('2026-07-20');
    await button(page, 'Search').click();
    await text(page, 'Please choose a departure date from 2026-07-21 through 2026-08-04.');
    await expect(region(page, 'Ticket search')).toBeVisible();
});
test("REQ-3.1.2: Reject date beyond sale window", async ({ page }) => {
    await entry(page);
    await field(page, 'Date').fill('2026-08-05');
    await button(page, 'Search').click();
    await text(page, 'Please choose a departure date from 2026-07-21 through 2026-08-04.');
    await expect(region(page, 'Ticket search')).toBeVisible();
});
