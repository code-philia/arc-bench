// requirement: REQ-3.6.4
import { expect } from '@playwright/test';
import { test } from './fixtures/test';
import { entry, field, region, search, expectTrainIds } from './helpers';
test("REQ-3.6.4: Filter morning departures", async ({ page }) => {
    await entry(page);
    await search(page);
    await field(region(page, 'Filter'), 'Departure time').selectOption({ label: '06:00-12:00' });
    await expectTrainIds(page, ["G1001"]);
});
