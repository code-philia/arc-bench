// requirement: REQ-9.3.2
import { expect } from '@playwright/test';
import { test } from './fixtures/test';
import { entry, link, region } from './helpers';
test("REQ-9.3.2: Open guide with Quick Guide More", async ({ page }) => {
    await entry(page);
    await link(region(page, 'Quick Guide'), 'More').click();
    await expect(page.getByRole('tab', { name: 'Ticketing', exact: true })).toHaveAttribute('aria-selected', 'true');
    await expect(page.getByRole('tabpanel').getByRole('heading', { name: 'How to book tickets online?', exact: true })).toBeVisible();
});
