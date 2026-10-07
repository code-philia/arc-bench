// requirement: REQ-3.6.1
import { expect } from '@playwright/test';
import { test } from './fixtures/test';
import { entry, region, search, expectTrainIds } from './helpers';
test("REQ-3.6.1: Restrict train type", async ({ page }) => {
    await entry(page);
    await search(page);
    await region(page, 'Filter').getByRole('group', { name: 'Train type', exact: true }).getByRole('checkbox', { name: 'G/C/D', exact: true }).check();
    await expectTrainIds(page, ["G1001", "G1002"]);
});
test("REQ-3.6.1: Filter Other train types", async ({ page }) => {
    await entry(page);
    await search(page);
    await region(page, 'Filter').getByRole('group', { name: 'Train type', exact: true }).getByRole('checkbox', { name: 'Other', exact: true }).check();
    await expectTrainIds(page, ['K1003']);
});
test("REQ-3.6.1: Restore all train types", async ({ page }) => {
    await entry(page);
    await search(page);
    const group = region(page, 'Filter').getByRole('group', { name: 'Train type', exact: true });
    await group.getByRole('checkbox', { name: 'G/C/D', exact: true }).check();
    await expectTrainIds(page, ['G1001', 'G1002']);
    await group.getByRole('checkbox', { name: 'All', exact: true }).check();
    await expectTrainIds(page, ['G1001', 'G1002', 'K1003']);
});
