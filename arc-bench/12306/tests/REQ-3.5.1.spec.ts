// requirement: REQ-3.5.1
import { expect } from '@playwright/test';
import { test } from './fixtures/test';
import { entry, search, sortTrains } from './helpers';
test("REQ-3.5.1: Toggle Departure Time sorting", async ({ page }) => {
    await entry(page);
    await search(page);
    await sortTrains(page, "Departure Time", "departure");
});
