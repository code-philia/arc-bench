// requirement: REQ-3.4.2
import { expect } from '@playwright/test';
import { test } from './fixtures/test';
import { entry, button, field, region, search, expectTrainIds } from './helpers';
test("REQ-3.4.2: Change date using Travel dates", async ({ page }) => {
    await entry(page);
    await search(page);
    await button(region(page, 'Travel dates'), '2026-07-22').click();
    await expect(field(page, 'Date')).toHaveValue('2026-07-22');
    await expectTrainIds(page, ['G1001', 'G1002', 'K1003', 'G2002']);
});
