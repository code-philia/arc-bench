// requirement: REQ-9.2.2
import { expect } from '@playwright/test';
import { test } from './fixtures/test';
import { entry, guidePanel, home, link, navigationEntries, openMenu, region, selectedTab } from './helpers';
test("REQ-9.2.2: Open all dropdown guide categories", async ({ page }) => {
    await entry(page);
    for (const category of ['Ticketing', 'Endorsement and refund', 'Miscellaneous']) {
        await home(page);
        const dropdown = region(page, 'Travel guide categories');
        await openMenu(link(page.getByRole('navigation'), 'Travel guide'), dropdown);
        for (const name of ['Ticketing', 'Endorsement and refund', 'Miscellaneous']) {
            const group = region(dropdown, name);
            await expect(navigationEntries(group)).toHaveCount(5);
            await expect(link(group, 'More')).toHaveCount(1);
        }
        await link(region(dropdown, category), 'More').click();
        await expect(selectedTab(page, category)).toBeVisible();
        await expect(guidePanel(page, category)).toContainText(/\S+/);
    }
});
