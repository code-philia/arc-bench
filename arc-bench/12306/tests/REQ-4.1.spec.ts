// requirement: REQ-4.1
import { expect } from '@playwright/test';
import { test } from './fixtures/test';
import { entry, expectTrainIds, link, planDetails, planEntry, planIds, plans, region, search } from './helpers';
test("REQ-4.1: Show feasible plans and segment details", async ({ page }) => {
    await entry(page);
    await search(page, 'Yancheng', 'Lhasa');
    await expectTrainIds(page, []);
    await expect.poll(() => planIds(page)).toEqual(['D2002', 'D2001']);
    const p = planEntry(page, 'D2001');
    const details = await planDetails(page, 'D2001');
    for (const value of ['D2001', 'Yancheng', 'Beijing', '08:00', '12:00', 'CNY 200', 'Z21', 'Lhasa', '13:00', '19:00', 'CNY 400'])
        expect(details).toContain(value);
    expect(details).toMatch(/\b2100\s*min(?:utes?)?\b/i);
    await expect(link(p, 'Book')).toBeEnabled();
    await expect(region(page, 'Transfer plans').getByText('D2003')).not.toBeVisible();
    for (const plan of plans) {
        const minutes = plan.wait;
        const duration = `(?:${minutes}\\s*min(?:utes?)?|${Math.floor(minutes / 60)}\\s*h\\s*${minutes % 60}\\s*m)`;
        expect(await planDetails(page, plan.first)).toMatch(new RegExp(`\\bwaiting(?:\\s+time)?\\s*:?\\s*${duration}\\b`, 'i'));
    }
});
