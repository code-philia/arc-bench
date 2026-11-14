// requirement: REQ-5.7.2
import { expect } from '@playwright/test';
import { test } from './fixtures/test';
import { checkHeaders, entry, login, orders, row } from './helpers';
import { history } from './fixtures/data';
test("REQ-5.7.2: Inspect completed historical order", async ({ page }) => {
    await entry(page);
    await login(page, history.username);
    await orders(page, 'History orders');
    await checkHeaders(page, ['Train Information', 'Passenger Information', 'Seat Information', 'Price', 'Status', 'Total Price']);
    await expect(row(page, history.train)).toContainText('completed');
});
