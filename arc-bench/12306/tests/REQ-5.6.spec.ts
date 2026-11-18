// requirement: REQ-5.6
import { expect } from '@playwright/test';
import { test } from './fixtures/test';
import { centerMenu, centerMenuEntry, createAccount, entry, home, link, openMenu, selectedTab } from './helpers';
test("REQ-5.6: Open Upcoming trips through Refund quick entry", async ({ page }) => {
    await entry(page);
    await createAccount(page);
    await home(page);
    await expect(link(page, 'Sign Out')).toBeVisible();
    await openMenu(link(page.getByRole('navigation'), 'Booking'), link(page, 'Refund'));
    await link(page, 'Refund').click();
    await expect(centerMenuEntry(centerMenu(page), 'Order center')).toBeVisible();
    await expect(selectedTab(page, 'Upcoming trips')).toBeVisible();
});
