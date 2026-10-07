// requirement: REQ-5.1.2
import { expect } from '@playwright/test';
import { test } from './fixtures/test';
import { entry, link, region, login, center, defaultResults, booking } from './helpers';
test("REQ-5.1.2: Book from personal notice", async ({ page }) => {
    await entry(page);
    await login(page, 'personal_center_user');
    await center(page);
    await link(region(page, 'Notice'), 'ticket booking').click();
    await defaultResults(page);
});
