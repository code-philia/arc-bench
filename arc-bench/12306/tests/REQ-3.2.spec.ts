// requirement: REQ-3.2
import { expect } from '@playwright/test';
import { test } from './fixtures/test';
import { entry, field, text, region, search, expectTrainIds, checkHeaders, trains } from './helpers';
test("REQ-3.2: Show matching trains and preserve criteria", async ({ page }) => {
    await entry(page);
    await search(page);
    await expect(page.getByPlaceholder('From', { exact: true })).toHaveValue('Shanghai');
    await expect(page.getByPlaceholder('To', { exact: true })).toHaveValue('Beijing');
    await expect(field(page, 'Date')).toHaveValue('2026-07-21');
    await text(page, 'Shanghai (上海) - Beijing (北京)');
    await text(page, '3 results');
    await expect(region(page, 'Travel dates')).toBeVisible();
    await expect(region(page, 'Filter')).toBeVisible();
    await checkHeaders(page, ['Train No.', 'Departure Time', 'Travel time', 'Arrival Time', 'Price']);
    await expectTrainIds(page, ['G1001', 'G1002', 'K1003']);
});
test("REQ-3.2: Reject empty From", async ({ page }) => {
    await entry(page);
    await search(page, 'Shanghai', 'Beijing', '2026-07-21', "From");
    await text(page, "Please enter a valid departure place.");
    await expect(region(page, 'Ticket search')).toBeVisible();
});
test("REQ-3.2: Reject empty To", async ({ page }) => {
    await entry(page);
    await search(page, 'Shanghai', 'Beijing', '2026-07-21', "To");
    await text(page, "Please enter a valid arrival place.");
    await expect(region(page, 'Ticket search')).toBeVisible();
});
