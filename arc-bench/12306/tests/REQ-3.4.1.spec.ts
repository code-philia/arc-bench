// requirement: REQ-3.4.1
import { expect } from '@playwright/test';
import { test } from './fixtures/test';
import { entry, button, field, search, expectTrainIds } from './helpers';
test("REQ-3.4.1: Change date using date picker", async ({ page }) => {
    await entry(page);
    await search(page);
    await field(page, 'Date').click();
    await button(page, '2026-07-22').click();
    await button(page, 'Search').click();
    await expect(field(page, 'Date')).toHaveValue('2026-07-22');
    await expectTrainIds(page, ['G1001', 'G1002', 'K1003', 'G2002']);
});
