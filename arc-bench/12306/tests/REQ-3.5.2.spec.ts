// requirement: REQ-3.5.2
import { expect } from '@playwright/test';
import { test } from './fixtures/test';
import { entry, search, sortTrains } from './helpers';
test("REQ-3.5.2: Toggle Travel time sorting", async ({ page }) => {
    await entry(page);
    await search(page);
    await sortTrains(page, "Travel time", "duration");
});
