// requirement: REQ-3.2
import { expect } from '@playwright/test';
import { test, travelDate } from './fixtures/test';
import { checkHeaders, entry, expectTrainIds, field, region, search, text } from './helpers';
import { trains } from './fixtures/data';
test("REQ-3.2: Show matching trains and preserve criteria", async ({ page }) => {
    await entry(page);
    await search(page);
    await expect(field(page, 'From')).toHaveValue('Shanghai');
    await expect(field(page, 'To')).toHaveValue('Beijing');
    await expect(field(page, 'Date')).toHaveValue(travelDate(page));
    await text(page, 'Shanghai (上海) - Beijing (北京)');
    await text(page, '3 results');
    await expect(region(page, 'Travel dates')).toBeVisible();
    await expect(region(page, 'Filter')).toBeVisible();
    await checkHeaders(page, ['Train No.', 'Departure Time', 'Travel time', 'Arrival Time', 'Price']);
    await expectTrainIds(page, trains.map(train => train.number));
});
test("REQ-3.2: Reject empty From", async ({ page }) => {
    await entry(page);
    await search(page, 'Shanghai', 'Beijing', travelDate(page), "From");
    await text(page, "Please enter a valid departure place.");
    await expect(region(page, 'Ticket search')).toBeVisible();
});
test("REQ-3.2: Reject empty To", async ({ page }) => {
    await entry(page);
    await search(page, 'Shanghai', 'Beijing', travelDate(page), "To");
    await text(page, "Please enter a valid arrival place.");
    await expect(region(page, 'Ticket search')).toBeVisible();
});
