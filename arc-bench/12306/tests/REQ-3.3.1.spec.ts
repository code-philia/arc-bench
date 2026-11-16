// requirement: REQ-3.3.1
import { expect } from '@playwright/test';
import { test } from './fixtures/test';
import { button, entry, expectSecondClassFare, row, search } from './helpers';
import { trains } from './fixtures/data';
test("REQ-3.3.1: Show fare with bookable other class", async ({ page }) => {
    await entry(page);
    await search(page);
    const train = trains[0];
    const r = row(page, train.number);
    await expectSecondClassFare(r, train.second_price);
    await expect(button(r, 'Book')).toBeEnabled();
});
