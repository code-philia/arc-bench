// requirement: REQ-9.2.1
import { expect } from '@playwright/test';
import { test } from './fixtures/test';
import { entry, link, region, home } from './helpers';
test("REQ-9.2.1: Open all dropdown guide categories", async ({ page }) => {
    await entry(page);
    for (const category of ['Ticketing', 'Endorsement and refund', 'Miscellaneous']) {
        await home(page);
        await link(page.getByRole('navigation'), 'Travel guide').hover();
        const dropdown = region(page, 'Travel guide categories');
        for (const name of ['Ticketing', 'Endorsement and refund', 'Miscellaneous']) {
            const group = region(dropdown, name);
            await expect(group.getByRole('link')).toHaveCount(5);
            await expect(link(group, 'More')).toHaveCount(1);
        }
        await link(region(dropdown, category), 'More').click();
        await expect(page.getByRole('tab', { name: category, exact: true })).toHaveAttribute('aria-selected', 'true');
        await expect(page.getByRole('tabpanel', { name: category, exact: true })).toContainText(/\S+/);
    }
});
