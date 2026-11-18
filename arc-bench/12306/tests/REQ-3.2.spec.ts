// requirement: REQ-3.2
import { expect, type Page } from '@playwright/test';
import { test, travelDate } from './fixtures/test';
import { button, checkHeaders, entry, expectTrainIds, field, region, routeSummary, search, text, travelDates } from './helpers';
import { trains } from './fixtures/data';

async function expectSearchControlsVisible(page: Page) {
    for (const label of ['From', 'To', 'Date']) {
        await expect(field(page, label)).toBeVisible();
    }
    await expect(button(page, 'Search')).toBeVisible();
}

test("REQ-3.2: Show matching trains and preserve criteria", async ({ page }) => {
    await entry(page);
    await search(page);
    await expect(field(page, 'From')).toHaveValue('Shanghai');
    await expect(field(page, 'To')).toHaveValue('Beijing');
    await expect(field(page, 'Date')).toHaveValue(travelDate(page));
    await expect(routeSummary(page)).toBeVisible();
    await expect(page.getByText(/\b3\s+results\b/)).toBeVisible();
    await expect(travelDates(page)).toBeVisible();
    await expect(region(page, 'Filter')).toBeVisible();
    await checkHeaders(page, ['Train No.', 'Departure Time', 'Travel time', 'Arrival Time', 'Price']);
    await expectTrainIds(page, trains.map(train => train.number));
});
test("REQ-3.2: Reject empty From", async ({ page }) => {
    await entry(page);
    await search(page, 'Shanghai', 'Beijing', travelDate(page), "From");
    await text(page, "Please enter a valid departure place.");
    await expectSearchControlsVisible(page);
});
test("REQ-3.2: Reject empty To", async ({ page }) => {
    await entry(page);
    await search(page, 'Shanghai', 'Beijing', travelDate(page), "To");
    await text(page, "Please enter a valid arrival place.");
    await expectSearchControlsVisible(page);
});
