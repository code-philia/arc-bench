// requirement: REQ-9.2.2
import { expect } from '@playwright/test';
import { test } from './fixtures/test';
import { entry, link, region } from './helpers';
test("REQ-9.2.2: Open dropdown question anchor", async ({ page }) => {
    await entry(page);
    await link(page.getByRole('navigation'), 'Travel guide').hover();
    await link(region(region(page, 'Travel guide categories'), 'Ticketing'), 'How to book tickets online?').click();
    await expect(page.getByRole('tab', { name: 'Ticketing', exact: true })).toHaveAttribute('aria-selected', 'true');
    await expect(page.getByRole('heading', { name: 'How to book tickets online?', exact: true })).toBeInViewport();
    await expect(page.getByRole('tabpanel', { name: 'Ticketing', exact: true })).toContainText(/\S+/);
});
