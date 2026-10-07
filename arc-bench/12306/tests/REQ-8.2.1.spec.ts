// requirement: REQ-8.2.1
import { expect } from '@playwright/test';
import { test } from './fixtures/test';
import { entry, button, region, booking } from './helpers';
test("REQ-8.2.1: Inspect selected train and availability", async ({ page }) => {
    await entry(page);
    await booking(page, 'bookable_user');
    await expect(page.getByRole('heading', { name: 'Train Information:', exact: true })).toBeVisible();
    for (const value of ['G1001', 'Shanghai', 'Beijing', '2026-07-21', 'business-class seat ( ￥1870.0 ) 32% off 1 left', 'first-class seat ( ￥967.0 ) 24% off None left', 'second-class seat ( ￥576.0 ) 27% off None left', 'standing ticket ( ￥576.0 ) 27% off Enough left'])
        await expect(region(page, 'Train Information')).toContainText(value);
    await expect(button(page, 'Place order')).toBeVisible();
});
