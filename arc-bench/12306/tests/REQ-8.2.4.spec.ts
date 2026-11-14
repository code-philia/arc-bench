// requirement: REQ-8.2.4
import { expect } from '@playwright/test';
import { test } from './fixtures/test';
import { booking, entry, heading, link } from './helpers';
import { bookingAccounts } from './fixtures/data';
test("REQ-8.2.4: Read booking terms", async ({ page }) => {
    await entry(page);
    await booking(page, bookingAccounts.inspect);
    await link(page, /^(?:I have read and agree to the )?Terms of Service$/).click();
    await expect(heading(page, 'Terms of Service')).toBeVisible();
});
