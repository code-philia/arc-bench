// requirement: REQ-9.1
import { expect } from '@playwright/test';
import { test } from './fixtures/test';
import { entry, guidePanel, heading, link, selectedTab, tab } from './helpers';
test("REQ-9.1: Browse guide category content", async ({ page }) => {
    await entry(page);
    await link(page.getByRole('navigation'), 'Travel guide').click();
    await expect(heading(page, 'How to book tickets online?')).toBeVisible();
    for (const name of ['Ticketing', 'Endorsement and refund', 'Miscellaneous']) {
        const t = tab(page, name);
        await expect(t).toBeVisible();
        await t.click();
        await expect(selectedTab(page, name)).toBeVisible();
        await expect(guidePanel(page, name)).toContainText(/\S+/);
    }
});
