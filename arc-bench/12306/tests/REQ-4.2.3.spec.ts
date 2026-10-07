// requirement: REQ-4.2.3
import { expect } from '@playwright/test';
import { test } from './fixtures/test';
import { entry, search, sortPlans } from './helpers';
test("REQ-4.2.3: Toggle transfer Arrival Time", async ({ page }) => {
    await entry(page);
    await search(page, 'Yancheng', 'Lhasa');
    await sortPlans(page, "Arrival Time", "arrival");
});
