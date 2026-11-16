// requirement: REQ-9.2.3
import { expect } from '@playwright/test';
import { test } from './fixtures/test';
import { entry, guideCategory, guideDropdown, guidePanel, heading, link, selectedTab } from './helpers';
test("REQ-9.2.3: Open dropdown question anchor", async ({ page }) => {
    await entry(page);
    const dropdown = await guideDropdown(page);
    await link(guideCategory(page, dropdown, 'Ticketing'), 'How to book tickets online?').click();
    await expect(selectedTab(page, 'Ticketing')).toBeVisible();
    await expect(heading(guidePanel(page, 'Ticketing'), 'How to book tickets online?')).toBeInViewport();
    await expect(guidePanel(page, 'Ticketing')).toContainText(/\S+/);
});
