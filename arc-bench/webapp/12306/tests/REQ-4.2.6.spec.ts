import { expect, test } from '@playwright/test';
import * as h from './helpers';

// requirement: REQ-4.2.6
// fixtures: orders_empty_user

test('REQ-4.2.6: Display the empty state in upcoming trips', async ({ page }) => {
  await h.openTicketOrders(page, h.FIXTURES.ordersEmptyUser);
  await h.clickNamed(page, 'Upcoming trips');
  await h.expectTextsVisible(page, ["You don't have any bookings or we can't access your bookings at this time."]);
  await expect(page.locator('img[src="/assets/empty.png"]')).toBeVisible();
});
