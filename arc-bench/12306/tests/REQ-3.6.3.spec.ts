// requirement: REQ-3.6.3
import { expect } from '@playwright/test';
import { test } from './fixtures/test';
import { entry, field, region, search, expectTrainIds } from './helpers';
test("REQ-3.6.3: Filter arrival station", async ({ page }) => {
    await entry(page);
    await search(page);
    await field(region(page, 'Filter'), 'To Station').selectOption({ label: 'Beijing South' });
    await expectTrainIds(page, ["G1001", "K1003"]);
});
