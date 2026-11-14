// requirement: REQ-5.6
import { expect } from '@playwright/test';
import { test } from './fixtures/test';
import { centerMenu, createAccount, entry, link, openMenu, selectedTab } from './helpers';
test("REQ-5.6: Open Upcoming trips through Refund quick entry", async ({ page }) => {
    await entry(page);
    await createAccount(page);
    await openMenu(link(page.getByRole('navigation'), 'Booking'), link(page, 'Refund'));
    await link(page, 'Refund').click();
    await expect(link(centerMenu(page), 'Order center')).toBeVisible();
    await expect(selectedTab(page, 'Upcoming trips')).toBeVisible();
});
