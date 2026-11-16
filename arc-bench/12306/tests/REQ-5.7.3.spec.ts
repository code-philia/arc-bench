// requirement: REQ-5.7.3
import { expect } from '@playwright/test';
import { test } from './fixtures/test';
import { addDays } from './fixtures/clock';
import { button, entry, fillDates, login, orderKeyword, orders, picture, row, text } from './helpers';
import { history } from './fixtures/data';
test("REQ-5.7.3: Search history departure range", async ({ page }) => {
    await entry(page);
    await login(page, history.username);
    await orders(page, 'History orders');
    await fillDates(page, history.departure, addDays(history.departure, 2), "");
    await expect(row(page, history.train)).toBeVisible();
});
test("REQ-5.7.3: Exclude history outside date range", async ({ page }) => {
    await entry(page);
    await login(page, history.username);
    await orders(page, 'History orders');
    await fillDates(page, addDays(history.departure, 1), addDays(history.departure, 2), history.train);
    await expect(picture(page, 'No orders')).toBeVisible();
    await expect(row(page, history.train)).not.toBeVisible();
});
test("REQ-5.7.3: Exclude history nonmatching keyword", async ({ page }) => {
    await entry(page);
    await login(page, history.username);
    await orders(page, 'History orders');
    await fillDates(page, history.departure, addDays(history.departure, 2), "Z9999");
    await expect(picture(page, 'No orders')).toBeVisible();
    await expect(row(page, history.train)).not.toBeVisible();
});
test("REQ-5.7.3: Reject invalid history keyword", async ({ page }) => {
    await entry(page);
    await login(page, history.username);
    await orders(page, 'History orders');
    await orderKeyword(page).fill('***');
    await button(page, 'Search').click();
    await text(page, 'Please enter a valid search condition.');
});
