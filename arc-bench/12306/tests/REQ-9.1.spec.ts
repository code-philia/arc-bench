// requirement: REQ-9.1
import { expect } from '@playwright/test';
import { test } from './fixtures/test';
import { entry, link } from './helpers';
test("REQ-9.1: Browse guide category content", async ({ page }) => {
    await entry(page);
    await link(page.getByRole('navigation'), 'Travel guide').click();
    await expect(page.getByRole('heading', { name: 'How to book tickets online?', exact: true })).toBeVisible();
    for (const name of ['Ticketing', 'Endorsement and refund', 'Miscellaneous']) {
        const t = page.getByRole('tab', { name, exact: true });
        await expect(t).toBeVisible();
        await t.click();
        await expect(t).toHaveAttribute('aria-selected', 'true');
        await expect(page.getByRole('tabpanel', { name, exact: true })).toContainText(/\S+/);
    }
});
