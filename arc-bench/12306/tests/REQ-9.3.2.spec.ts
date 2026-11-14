// requirement: REQ-9.3.2
import { expect } from '@playwright/test';
import { test } from './fixtures/test';
import { entry, guidePanel, link, region, selectedTab } from './helpers';
test("REQ-9.3.2: Open guide with Quick Guide More", async ({ page }) => {
    await entry(page);
    await link(region(page, 'Quick Guide'), 'More').click();
    await expect(selectedTab(page, 'Ticketing')).toBeVisible();
    await expect(guidePanel(page, "Ticketing").getByRole('heading', { name: 'How to book tickets online?', exact: true })).toBeVisible();
});
