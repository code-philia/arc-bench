// requirement: REQ-3.7
import { expect } from '@playwright/test';
import { test } from './fixtures/test';
import { entry, link, defaultResults } from './helpers';
test("REQ-3.7: Open Tickets quick entry", async ({ page }) => {
    await entry(page);
    await link(page.getByRole('navigation'), 'Booking').hover();
    await link(page, 'Tickets').click();
    await defaultResults(page);
});
