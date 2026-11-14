// requirement: REQ-9.2.3
import { expect } from '@playwright/test';
import { test } from './fixtures/test';
import { entry, guidePanel, heading, link, openMenu, region, selectedTab } from './helpers';
test("REQ-9.2.3: Open dropdown question anchor", async ({ page }) => {
    await entry(page);
    await openMenu(link(page.getByRole('navigation'), 'Travel guide'), region(page, 'Travel guide categories'));
    await link(region(region(page, 'Travel guide categories'), 'Ticketing'), 'How to book tickets online?').click();
    await expect(selectedTab(page, 'Ticketing')).toBeVisible();
    await expect(heading(guidePanel(page, 'Ticketing'), 'How to book tickets online?')).toBeInViewport();
    await expect(guidePanel(page, 'Ticketing')).toContainText(/\S+/);
});
