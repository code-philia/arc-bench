// requirement: REQ-4.1
import { expect } from '@playwright/test';
import { test } from './fixtures/test';
import { entry, button, region, search, planIds, expectTrainIds, plans } from './helpers';
test("REQ-4.1: Show feasible plans and segment details", async ({ page }) => {
    await entry(page);
    await search(page, 'Yancheng', 'Lhasa');
    await expectTrainIds(page, []);
    await expect.poll(() => planIds(page)).toEqual(['D2002', 'D2001']);
    const p = region(page, 'Transfer plans').getByRole('article').filter({ hasText: 'D2001' });
    for (const value of ['D2001', 'Yancheng', 'Beijing', '08:00', '12:00', 'CNY 200', 'Z21', 'Lhasa', '13:00', '19:00', 'CNY 400', 'Transfer waiting 1h 0m', 'Total travel time: 2100 minutes'])
        await expect(p).toContainText(value);
    await expect(button(p, 'Book')).toBeEnabled();
    await expect(region(page, 'Transfer plans').getByText('D2003')).not.toBeVisible();
    for (const plan of plans)
        await expect(region(page, 'Transfer plans').getByRole('article').filter({ hasText: plan.first })).toContainText(`Transfer waiting ${Math.floor(plan.wait / 60)}h ${plan.wait % 60}m`);
});
