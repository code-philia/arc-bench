// requirement: REQ-3.3.1
import { expect } from '@playwright/test';
import { test } from './fixtures/test';
import { entry, button, row, search } from './helpers';
test("REQ-3.3.1: Show fare with bookable other class", async ({ page }) => {
    await entry(page);
    await search(page);
    const r = row(page, 'G1001');
    await expect(r).toContainText('Second-class seat');
    await expect(r).toContainText('CNY 576');
    await expect(button(r, 'Book')).toBeEnabled();
});
