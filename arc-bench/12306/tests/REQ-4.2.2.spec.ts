// requirement: REQ-4.2.2
import { expect } from '@playwright/test';
import { test } from './fixtures/test';
import { entry, search, sortPlans } from './helpers';
test("REQ-4.2.2: Toggle transfer Travel time", async ({ page }) => {
    await entry(page);
    await search(page, 'Yancheng', 'Lhasa');
    await sortPlans(page, "Travel time", "total");
});
