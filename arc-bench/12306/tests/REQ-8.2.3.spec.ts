// requirement: REQ-8.2.3
import { expect } from '@playwright/test';
import { test } from './fixtures/test';
import { entry, link, booking } from './helpers';
test("REQ-8.2.3: Read booking terms", async ({ page }) => {
    await entry(page);
    await booking(page, 'bookable_user');
    await link(page, 'I have read and agree to the Terms of Service').click();
    await expect(page.getByRole('heading', { name: 'Terms of Service', exact: true })).toBeVisible();
});
