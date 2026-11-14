// requirement: REQ-8.2.2
import { expect } from '@playwright/test';
import { test } from './fixtures/test';
import { booking, button, entry, heading, region } from './helpers';
import { bookingAccounts } from './fixtures/data';
test("REQ-8.2.2: Inspect selected train and availability", async ({ page }) => {
    await entry(page);
    const journey = await booking(page, bookingAccounts.inspect);
    await expect(heading(page, /^Train Information:?$/i)).toBeVisible();
    const details = region(page, 'Train Information');
    for (const value of [journey.train, 'Shanghai', 'Beijing', journey.date])
        await expect(details).toContainText(value);
    // Match every class with its own fare, discount and availability, allowing currency formatting.
    for (const fare of [
        /business-class seat\s*\(?\s*(?:[￥¥]|CNY)\s*1,?870(?:\.0{1,2})?\s*\)?\s*32% off\s*1 left/i,
        /first-class seat\s*\(?\s*(?:[￥¥]|CNY)\s*967(?:\.0{1,2})?\s*\)?\s*24% off\s*(?:none|0) left/i,
        /second-class seat\s*\(?\s*(?:[￥¥]|CNY)\s*576(?:\.0{1,2})?\s*\)?\s*27% off\s*(?:none|0) left/i,
        /standing ticket\s*\(?\s*(?:[￥¥]|CNY)\s*576(?:\.0{1,2})?\s*\)?\s*27% off\s*enough left/i,
    ]) await expect(details).toContainText(fare);
    await expect(button(page, 'Place order')).toBeVisible();
});
