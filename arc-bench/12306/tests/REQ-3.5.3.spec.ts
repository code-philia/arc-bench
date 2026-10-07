// requirement: REQ-3.5.3
import { expect } from '@playwright/test';
import { test } from './fixtures/test';
import { entry, search, sortTrains } from './helpers';
test("REQ-3.5.3: Toggle Arrival Time sorting", async ({ page }) => {
    await entry(page);
    await search(page);
    await sortTrains(page, "Arrival Time", "arrival");
});
